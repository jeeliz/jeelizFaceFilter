export interface JeelizFaceFilterInitVideoSettings {
    /**
     *  not set by default. <video> element used
    WARN: If you specify this parameter,
          1. all other settings will be useless
          2. it means that you fully handle the video aspect
          3. in case of using web-camera device make sure that
             initialization goes after `loadeddata` event of the `videoElement`,
             otherwise face detector will yield very low `detectState.detected` values
             (to be more sure also await first `timeupdate` event)
     */
    videoElement?: HTMLVideoElement;
    /**  not set by default */
    deviceId?: string;
    /**  to use the rear camera, set to 'environment' */
    facingMode?: string;
    /** ideal video width in pixels */
    idealWidth?: number;
    /** ideal video height in pixels */
    idealHeight?: number;
    /** min video width in pixels */
    minWidth?: number;
    /** max video width in pixels */
    maxWidth?: number;
    /** min video height in pixels */
    minHeight?: number;
    /**  max video height in pixels, */
    maxHeight?: number;
    /** rotation in degrees possible values: 0,90,-90,180 */
    rotate?: number;
    /** if we should flip horizontally the video. Default: false */
    flipX?: boolean;  
}
export interface IJeelizFaceFilterScanSettings {
    minScale: number;
    maxScale: number;
    borderwidth: number;
    borderHeight: number;
    nStepsX: number;
    nStepsY: number;
    nStepsScale: number;
    nDetectsPerLoop: number;
}
export interface IJeelizFaceFilterStabilizationSettings {
    translationFactorRange: [number, number];
    rotationFactorRange: [number, number];
    qualityFactorRange: [number, number];
    alphaRange: [number, number];
}
export interface IJeelizFaceFilterDetectState {
    /** the face detection probability, between 0 and 1, */
    detected: 0 | 1;
    /** : The 2D coordinates of the center of the detection frame in the viewport (each between -1 and 1, x from left to right and y from bottom to top), */
    x: number;
    /** : The 2D coordinates of the center of the detection frame in the viewport (each between -1 and 1, x from left to right and y from bottom to top), */
    y: number;
    /** the scale along the horizontal axis of the detection frame, between 0 and 1 (1 for the full width). The detection frame is always square, */
    s: number;
    /**  the Euler angles of the head rotation in radians. */
    rx: number;
    /**  the Euler angles of the head rotation in radians. */
    ry: number;
    /**  the Euler angles of the head rotation in radians. */
    rz: number;
    /** array listing the facial expression coefficients:
        expressions[0]: mouth opening coefficient (0 → mouth closed, 1 → mouth fully opened) */
    expressions: Float32Array;
}
export interface IJeelizFaceFilterInitParams {
    callbackReady?: (err: string | false, spec: IJeelizFaceFilterInitResult) => void;
    callbackTrack?: (detectState: IJeelizFaceFilterDetectState) => void;
    /**
     * It is used only in normal rendering mode (not in slow rendering mode). With this statement you can set accurately the number of milliseconds during which the browser wait at the end of the rendering loop before starting another detection. If you use the canvas of this API as a secondary element (for example in PACMAN or EARTH NAVIGATION demos) you should set a small animateDelay value (for example 2 milliseconds) in order to avoid rendering lags.
     */
    animateDelay?: number;
    NNCPath?: string;
    NNC?: string;
    /**
     * Only for multiple face detection - maximum number of faces which can be detected and tracked. Should be between 1 (no multiple detection) and 8,
     */
    maxFacesDetected?: number;
    /**
     * Allow full rotation around depth axis. Default value: false. See Issue 42 for more details,
     */
    followZRot?: boolean;
    canvasId?: string;
    canvas?: HTMLCanvasElement;
    scanSettings?: IJeelizFaceFilterScanSettings;
    stabilizationSettings?: IJeelizFaceFilterStabilizationSettings;
    videoSettings?: JeelizFaceFilterInitVideoSettings;
    /**
     * Function launched just before asking for the user to allow its webcam sharing,
     */
    onWebcamAsk?: () => void;
    onWebcamGet?: (videoElement: HTMLVideoElement, stream?: MediaStream, videoTrackInfo?: any) => void;
}
export interface IJeelizFaceFilterInitResult {
    /** the <canvas> element, */
    canvasElement:HTMLCanvasElement;
    /**  the WebGL context. The rendering 3D engine should use this WebGL context, */
    GL:WebGL2RenderingContext;
    /** a WebGL texture displaying the camera video. It has the same resolution as the camera video, */
    videoTexture:WebGLTexture;
    /**  the video used as source for the webgl texture videoTexture, */
    videoElement:HTMLVideoElement;
    /**  flatten 2x2 matrix encoding a scaling and a rotation. We should apply this matrix to viewport coordinates to render videoTexture in the viewport, */
    videoTransformMat2:number[];
    /** the maximum number of detected faces. */
    maxFacesDetected: number;
}
export interface IJeelizFaceFilter {

    init(params: IJeelizFaceFilterInitParams): boolean;
    /** Should be called before the init method. 2 arguments are provided to the callback function:

<array> mediaDevices: an array with all the devices founds. Each device is a javascript object having a deviceId string attribute. This value can be provided to the init method to use a specific webcam. If an error happens, this value is set to false,
<string> errorLabel: if an error happens, the label of the error. It can be: NOTSUPPORTED, NODEVICESFOUND or PROMISEREJECTED.
     */
    get_videoDevices(callback: (mediaDevices: Array<{deviceId: string}> | false, errorLabel?: string) => void): any;

    /** Change the video input by a WebGL Texture instance. The dimensions of the texture, in pixels, should be provided, Come back to the user's video as input texture, */
    reset_inputTexture(): void;

    /**  should be called after resizing the <canvas> element to adapt the cut of the video. 
     * It should also be called if the device orientation is changed to take account of new video dimensions, */
    resize(): boolean;
    /** Change the animateDelay (see init() arguments), */
    set_animateDelay(delay: number): void;

    set_inputTexture(tex: WebGLTexture, width: number, height: number): void;

    /** Override scan settings. scanSettings is a dictionnary with the following properties:

        <float> scale0Factor: Relative width (1 -> full width) of the searching window at the largest scale level. Default value is 0.8,
        <int> nScaleLevels: Number of scale levels. Default is 3,
        [<float>, <float>, <float>] overlapFactors: relative overlap according to X,Y and scale axis between 2 searching window positions. Higher values make scan faster but it may miss some positions. Set to [1, 1, 1] for no overlap. Default value is [2, 2, 3],
        <int> nDetectsPerLoop: specify the number of detection per drawing loop. -1 for adaptative value. Default: -1 */
    set_scanSettings(settings: IJeelizFaceFilterScanSettings): void;

    /** Override detection stabilization settings. The output of the neural network is always noisy, so we need to stabilize it using a floatting average to avoid shaking artifacts. The internal algorithm computes first a stabilization factor k between 0 and 1. If k==0.0, the detection is bad and we favor responsivity against stabilization. It happens when the user is moving quickly, rotating the head or when the detection is bad. On the contrary, if k is close to 1, the detection is nice and the user does not move a lot so we can stabilize a lot. stabilizationSettings is a dictionnary with the following properties:

[<float> minValue, <float> maxValue] translationFactorRange: multiply k by a factor kTranslation depending on the translation speed of the head (relative to the viewport). kTranslation=0 if translationSpeed<minValue and kTranslation=1 if translationSpeed>maxValue. The regression is linear. Default value: [0.0015, 0.005],
[<float> minValue, <float> maxValue] rotationFactorRange: analogous to translationFactorRange but for rotation speed. Default value: [0.003, 0.02],
[<float> minValue, <float> maxValue] qualityFactorRange: analogous to translationFactorRange but for the head detection coefficient. Default value: [0.9, 0.98],
[<float> minValue, <float> maxValue] alphaRange: it specify how to apply k. Between 2 successive detections, we blend the previous detectState values with the current detection values using a mixing factor alpha. alpha=<minValue> if k<0.0 and alpha=<maxValue> if k>1.0. Between the 2 values, the variation is quadratic. Default value: [0.05, 1]. */
    set_stabilizationSettings(settings: IJeelizFaceFilterStabilizationSettings): void;

    /**  pause/resume. This method will completely stop the rendering/detection loop. If isShutOffVideo is set to true, the media stream track will be */
    toggle_pause(isPause?: boolean, isShutOffVideo?: boolean): any;

    /** : toggle the slow rendering mode: because this API consumes a lot of GPU resources, it may slow down other elements of the application.
     *  If the user opens a CSS menu for example, the CSS transitions and the DOM update can be slow. With this function you can
     *  slow down the rendering in order to relieve the GPU. Unfortunately the tracking and the 3D rendering will also be slower
     *  but this is not a problem is the user is focusing on other elements of the application. We encourage to enable the slow mode 
     * as soon as a the user's attention is focused on a different part of the canvas, */
    toggle_slow(isSlow?: boolean): any;

    /** change the video element used for the face detection (which can be provided via VIDEOSETTINGS.videoElement) by another video element.
     *  A callback function can be called when it is done. */
    update_videoElement(video: HTMLVideoElement, callback: () => void): void;

    /** Dynamically change the video settings (see Optional init arguments for the properties of videoSettings). It is useful to change the camera from 
     * the selfie camera (user) to the back (environment) camera. A Promise is returned.
     */
    update_videoSettings(videoSettings: JeelizFaceFilterInitVideoSettings): Promise<void>;

    /** Dynamically change videoSettings.rotate and videoSettings.flipX. This method should be called after initialization. 
     * The default values are 0 and false. The angle should be chosen among these values: 0, 90, 180, -90, */
    set_videoOrientation(angle: number, flipX: boolean);

    /** Clean both graphic memory and JavaScript memory, uninit the library. After that you need to init the library again. A Promise is returned, */
    destroy(): Promise<void>;

    /** reset the WebGL context */
    reset_GLState();

    /** render the video on the <canvas> element. */
    render_video();
}
