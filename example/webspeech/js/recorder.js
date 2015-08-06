/**
 * speech demo JS
 * recorder
 * 2014-11-18
 */

(function () {
    var WORKER_PATH = 'js/recorderWorker.js';
    //var WORKER_PATH1 = 'js/recorderWorker2.js';
    //var WORKER_PATH2 = 'js/speex.js';
    //var WORKER_PATH3 = 'js/vad.js';

    var Recorder = function (source, cfg) {
//        var cfg = {
//            type: 'audio/wav',
//            bufferLen: 4096,
//            workerPath: 'WORKER_PATH',
//            callback: function
//        };
        var self = this;
        var config = cfg || {};
        var bufferLen = config.bufferLen || 4096;
        this.context = source.context;
        if (!this.context.createScriptProcessor) {
            this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
        } else {
            this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
        }

        var worker = new Worker(config.workerPath || WORKER_PATH);
        //var worker1 = new Worker(WORKER_PATH1);
        //var worker2 = new Worker(WORKER_PATH2);
        //var worker3 = new Worker(WORKER_PATH3);
        worker.postMessage({
            command: 'init',
            config: {
                sampleRate: this.context.sampleRate
            }
        });
//        worker1.postMessage({
//            command: 'init',
//            config: {
//                compressPath: null,
//                sampleRate: this.context.sampleRate,
//                outputBufferLength: bufferLen
//            }
//        });
        var recording = false,
                listening = false,
                currCallback;

        this.node.onaudioprocess = function (e) {
            if (recording) {
                worker.postMessage({
                    command: 'record',
                    buffer: [
                        e.inputBuffer.getChannelData(0),
                        e.inputBuffer.getChannelData(1)
                    ]
                });
            }
//            if (listening) {
//                worker1.postMessage({
//                    command: 'record',
//                    buffer: e.inputBuffer.getChannelData(0)
//                });
//            }
        };

        this.configure = function (cfg) {
            for (var prop in cfg) {
                if (cfg.hasOwnProperty(prop)) {
                    config[prop] = cfg[prop];
                }
            }
        };

        this.record = function () {
            recording = true;
        };
        this.listen = function (callback, callback2) {
            listening = true;

            //worker1.postMessage({command: 'reset'});
            //worker3.postMessage({command: 'init'});
//            worker3.onmessage = function (e) {
//                if (e.data.type === "debug") {
//                    //postMessage({type:"debug", message:e.data.message});
//                    //LOGCAT(e.data.message);
//                } else if (e.data.command === "esvad") {
//                    callback2(e.data.message);
//                    //recording = false;
//                } else if (e.data.command === "volume") {
//                    //postMessage({command:"volume", message:e.data.message});
//                    //do nothing
//                }
//            };
//            worker2.postMessage({command: 'init'});
//            worker2.onmessage = function (e) {
//                if (e.data.type == "debug") {
//                    //postMessage({type:"debug", message:e.data.message});
//                    //LOGCAT(e.data.message);
//                } else if (e.data.command == "encode") {
//                    var buffer = e.data.buffer;
//                    var result = new Int8Array(buffer.length);
//                    for (var i = 0; i < buffer.length; i++)
//                        result[i] = buffer[i];
//                    callback(2, result.buffer);
//                }
//            };
        };

        this.stop = function () {
            recording = false;
        };
        this.listenStop = function () {
            listening = false;
        };

        this.clear = function () {
            worker.postMessage({command: 'clear'});
        };

        this.getBuffers = function (cb) {
            currCallback = cb || config.callback;
            worker.postMessage({command: 'getBuffers'});
        };

        this.exportWAV = function (cb, type) {
            currCallback = cb || config.callback;
            type = type || config.type || 'audio/wav';
            if (!currCallback)
                throw new Error('Callback not set');
            worker.postMessage({
                command: 'exportWAV',
                type: type
            });
        };

        this.exportMonoWAV = function (cb, type) {
            currCallback = cb || config.callback;
            type = type || config.type || 'audio/wav';
            if (!currCallback)
                throw new Error('Callback not set');
            worker.postMessage({
                command: 'exportMonoWAV',
                type: type
            });
        };

        worker.onmessage = function (e) {
            var blob = e.data;
            currCallback(blob);

            if (!listening)
                return;
            var buffer = e.data.buffer;
            var result = new Int16Array(buffer.length);
            for (var i = 0; i < buffer.length; i++)
                result[i] = buffer[i];
            //window.socket.emit("resample_data", result.buffer);
//            worker3.postMessage({
//                command: 'appendData',
//                pcmData: result,
//                nSamples: result.length
//            });

            var output = new Int8Array();
            var output_length;

//            worker2.postMessage({
//                command: 'encode',
//                inData: result,
//                inOffset: 0,
//                inCount: result.length,
//                outData: output,
//                outOffset: 0,
//                outCount: output_length
//            });
        };

        source.connect(this.node);
        this.node.connect(this.context.destination);   // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
    };

    Recorder.setupDownload = function (blob, filename) {
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var link = document.getElementById("save");
        link.href = url;
        link.download = filename || 'output.wav';
    };

    window.Recorder = Recorder;
})();
