###

  ScreenLogger

  @version 1.0
  @author  Dumitru Glavan
  @link    http://jslogger.com
  @link    http://dumitruglavan.com

###

class window.ScreenLogger

  logger: null

  session: null

  html2CanvasUrl: "//jslogger.com/html2canvas.js"

  logging: false

  profiling: false

  useCORS: true

  imageProxyUrl: null

  constructor: (options = {})->
    if not @isMobile() and @supportsCanvas()
      @setOptions options
      @loadDependencies @setupEvents

  supportsCanvas: ()->
    !!document.createElement("canvas").getContext

  isMobile: ()->
    navigator.appVersion.indexOf("Mobile") > -1

  setOptions: (options)->
    @logger = options.logger
    @session = options.session or new Date().getTime()
    @html2canvas = options.html2canvas or @html2canvas
    @logging = options.logging or @logging
    @profiling = options.profiling or @profiling
    @useCORS = options.useCORS or @useCORS
    @imageProxyUrl = options.imageProxyUrl or @imageProxyUrl

  loadDependencies: (callback)->
    if not window.html2canvas
      script = document.createElement("script")
      script.type = "text/javascript"
      script.src = @html2CanvasUrl
      script.onload = callback
      document.getElementsByTagName("body")[0].appendChild(script)
    else
      callback() if typeof callback isnt undefined

  setupEvents: ()=>
    document.onclick = @onClick

  log: (data, extraParams)->
    @logger.logDataByType("screen", data, extraParams) if @logger and @logger.track

  takeScreenshot: (callback)->
    opts =
      logging: @logging
      profile: @profiling
      useCORS: @useCORS
      proxy: @imageProxyUrl
      onrendered: (canvas)->
        try
          content = canvas.toDataURL()
          callback(content)
        catch e
          console.log(e)
          console.log(canvas)
    html2canvas(document.getElementsByTagName("body"), opts)

  onClick: (e)=>
    extraParams =
      event:
        type: "click"
        x: e.clientX
        y: e.clientY
    @takeScreenshot (image)=>
      extraParams.img = image
      @log(@session, extraParams)
