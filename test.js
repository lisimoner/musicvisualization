const video = document.getElementById('video')
      const downloadBtn = document.getElementById('download')
      const recordBtn = document.getElementById('record')
      const stopBtn = document.getElementById('stop')
      let recorder
 
      async function record() {
		  // 开始录屏
        let captureStream
 
        try{
          captureStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: {
                echoCancellation:true,
                noiseSuppression: true,
                channelCount: 1
            },//   not support
            cursor: 'always'
          })
        }catch(e){
			// 取消录屏或者报错
          alert("Could not get stream")
          return
        }
 
        downloadBtn.disabled = true
        recordBtn.style = 'display: none'
        stopBtn.style = 'display: inline'
 
		// 删除之前的 Blob
        window.URL.revokeObjectURL(video.src)
 
        video.autoplay = true
 
		// 实时的播放录屏
        video.srcObject = captureStream
 
		// new 一个媒体记录
        recorder = new MediaRecorder(captureStream)
        recorder.start()
 
        captureStream.getVideoTracks()[0].onended = () => {
			// 录屏结束完成
          recorder.stop()
        }
 
        recorder.addEventListener("dataavailable", event => {
			// 录屏结束，并且数据可用
			console.log("dataavailable------------")
          let videoUrl = URL.createObjectURL(event.data, {type: 'video/ogg'})
 
          video.srcObject = null
          video.src = videoUrl
          video.autoplay = false
 
          downloadBtn.disabled = false
          recordBtn.style = 'display: inline'
          stopBtn.style = 'display: none'
        })
      }
 
      function download(){
		  // 下载
        const url = video.src
        const name = new Date().toISOString().slice(0, 19).replace('T',' ').replace(" ","_").replace(/:/g,"-")
        const a = document.createElement('a')
 
        a.style = 'display: none'
        a.download = `${name}.ogg`
        a.href = url
 
        document.body.appendChild(a)
 
        a.click()
      }
 
      function stop(){
        let tracks = video.srcObject.getTracks()
        tracks.forEach(track => track.stop())
        recorder.stop()
      }