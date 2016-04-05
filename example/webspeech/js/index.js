/**
 * speech demo JS
 * index
 * 2015-03-23
 */

(function () {
    var WIN = window,
            DOC = document,
            NAV = navigator,
            LOC = location,
            HIS = history;
    var innerHTML = "innerHTML",
            className = "className",
            appendChild = "appendChild",
            style = "style";

    var Base = BASE;
    var Touch = Base.cfg.isTouch;
    var $$ = Base.getEle,
            $_ = Base.creEle,
            $D = Base.disEle,
            $T = Base.txtEle,
            $R = Base.rmvEle,
            $G = Base.getUrl,
            $GC = Base.getCoord,
            $EF = Base.execFun,
            $JP = Base.jsonParse,
            $JS = Base.jsonStringify,
            $SS = Base.setStorage,
            $GS = Base.getStorage,
            $ADPALLSTYLE = Base.adpAllStyle,
            $CREATESTYLE = Base.createStyle,
            $AJAX = Base.ajax;

    var body = DOC.body;
    var AudioCtx,
            GainNode,
            SourceReal,
            SourceAudio,
            Analyser,
            AudioRecorder;
    var CvsCtx,
            PixelTatio,
            CvsWidth,
            CvsHeight;
    var RafID, Stream;

    function initialize() {
        dealPrefix();
        initEvent();
        $D(body, 1);
    }
    function initEvent() {
        $$("#openBtn").onclick = toggleSpeech;
        $$("#recordBtn").onclick = speechRecord;
        $$("#outputBtn").onclick = speechOutput;

        $$("#listenBtn").onclick = speechListen;
        //$$("#writeBtn").onclick = speechWrite;
    }
    function toggleSpeech() {
        var btn = $$("#openBtn");
        if (btn.open) {
            close();
        } else {
            initMedia(open);
        }

        function open() {
            $T(btn, '关闭麦克风');
            btn[className] = 'btn btn-danger btn-lg';
            btn.open = 1;
            disableBtns(0);
        }
        function close() {
            try {
                closeAll();
                setTimeout(function () {
                    Stream.stop();
                    Stream = null;
                    disableBtns(1);
                    $D($$("#btnDisable"), 1);
                    $T(btn, '开启麦克风');
                    btn[className] = 'btn btn-primary btn-lg';
                    btn.open = 0;
                    Stream = null;
                }, 0);
            } catch (e) {
                showInfo('关闭麦克风失败：' + e);
            }
        }
    }
    function speechListen() {
        if (!$$("#openBtn").open || !Stream)
            return;
        var btn = $$("#listenBtn");
        if (!btn.register) {
            btn.close = closeToggle;
            btn.register = 1;
        }
        var audio = $$("#audio");
        btn.toggle ? closeToggle() : openToggle();

        function openToggle() {
            audio.src = ((WIN.URL || WIN.webkitURL)).createObjectURL(Stream);
            audio.onloadedmetadata = function (e) {
                audio.play();
            };
            btn.toggle = 1;
            $T(btn, '停止');
            btn[className] = 'btn btn-danger';
            btn[style].zIndex = 2;
            disableBtns(1);
        }
        function closeToggle() {
            audio.pause();
            btn.toggle = 0;
            $T(btn, '听声');
            btn[className] = 'btn btn-success';
            btn[style].zIndex = '';
            disableBtns(0);
        }
    }
    function speechRecord() {
        if (!$$("#openBtn").open || !Stream)
            return;
        var btn = $$("#recordBtn");
        if (!btn.register) {
            btn.recIndex = 0;
            btn.close = closeToggle;
            btn.register = 1;
        }

        btn.toggle ? closeToggle() : openToggle();

        function openToggle() {
            AudioRecorder.clear();
            AudioRecorder.record();

            btn.toggle = 1;
            $T(btn, '停止');
            btn[className] = 'btn btn-danger';
            btn[style].zIndex = 2;
            disableBtns(1);
        }
        function closeToggle() {
            AudioRecorder.stop();
            //AudioRecorder.getBuffers(gotBuffers);
            AudioRecorder.exportWAV(doneEncoding);

            btn.toggle = 0;
            $T(btn, '录音');
            btn[className] = 'btn btn-warning';
            btn[style].zIndex = '';
            disableBtns(0);
        }
    }
    function speechOutput() {
        if (!$$("#openBtn").open || !Stream)
            return;
        var btn = $$("#recordBtn");
        if (!btn.recIndex)
            alert('请先录音，再导出');
    }

    function initMedia(callback) {
        if (!NAV.getUserMedia)
            return showInfo('getUserMedia Error');
        if (!WIN.AudioContext)
            return showInfo('AudioContext Error');

        AudioCtx = new WIN.AudioContext();

        var obj = {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
            "vedio": false
        };

        NAV.getUserMedia(obj, gotStream, error);

        function error(e) {
            showInfo('Error: ' + e);
            console.log(e);
        }
        function gotStream(stream) {
            $EF(callback);
            console.log('%o', stream);
            Stream = stream;

            GainNode = AudioCtx.createGain();
            SourceReal = SourceAudio = AudioCtx.createMediaStreamSource(stream);
            SourceAudio.connect(GainNode);

            Analyser = AudioCtx.createAnalyser();
            Analyser.fftSize = 2048;
            GainNode.connect(Analyser);

            AudioRecorder = new Recorder(GainNode);

            var zeroGain = AudioCtx.createGain();
            zeroGain.gain.value = 0.0;
            GainNode.connect(zeroGain);
            zeroGain.connect(AudioCtx.destination);

            updateAnalysers();
        }
    }
    function updateAnalysers(time) {
        if (!CvsCtx) {
            var canvas = $$("#cvs");
            PixelTatio = getDevicePixelRatio();
            var styleWidth = canvas.offsetWidth;
            var styleHeight = canvas.offsetHeight;

            CvsWidth = styleWidth * PixelTatio;
            CvsHeight = styleHeight * PixelTatio;
            canvas.style.width = styleWidth;
            canvas.style.height = styleHeight;
            canvas.width = styleWidth;
            canvas.height = styleHeight;

            CvsCtx = canvas.getContext('2d');
        }

        draw();

        RafID = window.requestAnimationFrame(updateAnalysers);

        function draw() {
            var SPACING = 3;
            var BAR_WIDTH = 1;
            var numBars = Math.round(CvsWidth / SPACING);
            var freqByteData = new Uint8Array(Analyser.frequencyBinCount);

            Analyser.getByteFrequencyData(freqByteData);

            CvsCtx.clearRect(0, 0, CvsWidth, CvsHeight);
            CvsCtx.save();
            CvsCtx.beginPath();

            CvsCtx.fillStyle = '#F6D565';
            CvsCtx.lineCap = 'round';
            var multiplier = Analyser.frequencyBinCount / numBars;

            // Draw rectangle for each frequency bin.
            for (var i = 0; i < numBars; ++i) {
                var magnitude = 0;
                var offset = Math.floor(i * multiplier);
                // gotta sum/average the block, or we miss narrow-bandwidth spikes
                for (var j = 0; j < multiplier; j++)
                    magnitude += freqByteData[offset + j];
                magnitude = magnitude / multiplier;
                //var magnitude2 = freqByteData[i * multiplier];
                CvsCtx.fillStyle = "hsl( " + Math.round((i * 360) / numBars) + ", 100%, 50%)";
                CvsCtx.fillRect(i * SPACING, CvsHeight, BAR_WIDTH, -magnitude);
            }

            CvsCtx.restore();
        }
    }
    function doneEncoding(blob) {
        var btn = $$("#recordBtn");
        Recorder.setupDownload(blob, "myRecording" + ((btn.recIndex < 10) ? "0" : "") + btn.recIndex + ".wav");
        btn.recIndex += 1;
    }

    function closeAll() {
        var ary = ['recordBtn', 'outputBtn', 'listenBtn', 'writeBtn'];
        var btn;
        for (var i = 0; i < ary.length; i++) {
            btn = $$("#" + ary[i]);
            btn && btn.close && $EF(btn.close);
        }
    }

    function dealPrefix() {
        WIN.AudioContext = WIN.AudioContext || WIN.webkitAudioContext;
        NAV.getUserMedia = (
                NAV.getUserMedia ||
                NAV.webkitGetUserMedia ||
                NAV.mozGetUserMedia ||
                NAV.msGetUserMedia);
        NAV.requestAnimationFrame = (
                NAV.requestAnimationFrame ||
                NAV.webkitRequestAnimationFrame ||
                NAV.mozRequestAnimationFrame ||
                NAV.oRequestAnimationFrame ||
                NAV.msRequestAnimationFrame ||
                function (fun) {
                    WIN.setTimeout(fun, 16);
                });
        NAV.cancelAnimationFrame = (
                NAV.cancelAnimationFrame ||
                NAV.webkitCancelAnimationFrame ||
                NAV.mozCancelAnimationFrame ||
                NAV.oCancelAnimationFrame ||
                NAV.msCancelAnimationFrame);
    }
    function showInfo(info) {
        var Info = $$("#info");
        $T(Info, info);
        $D(Info, 1);
    }
    function disableBtns(bool) {
        $D($$("#btnDisable"), bool);
    }
    function getDevicePixelRatio() {
        return WIN.devicePixelRatio || 1;
    }

    (function () {
        var styleStr;
        if (Touch) {
            styleStr = 'body{font-size:18px;line-height:40px}#main{padding-bottom:20px}#nav{height:70px}#nav>p{line-height:70px;font-size:32px}#nav>a{bottom:4px;font-size:16px}#cvsCon{height:200px}#cvsCon>div{line-height:200px;font-size:36px;letter-spacing:60px;text-indent:60px}#textarea{margin:15px 2%;font-size:20px}.btnCon{padding:30px 0 15px 0}.btn{border-radius:4px;padding:8px 22px;font-size:18px}.btn-lg{padding:10px 30px;font-size:24px}';
            $ADPALLSTYLE(styleStr, '', initialize);
        } else {
            styleStr = '#main{width:480px}';
            $CREATESTYLE(styleStr, '', initialize);
        }
    })();
})();