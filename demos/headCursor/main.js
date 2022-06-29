// GLOBALs DECLARATIONS:

let EXPLANATION = 'This demonstration is designed for a 16:9 desktop screen, running full size (press F11 key).<br/>';
EXPLANATION += 'We study accessibility issues for disabled people.<br/>';
EXPLANATION += 'Open the mouth to click, rotate the head to move the cursor.<br/>';
EXPLANATION += 'For a better result, your face should be properly lit.';

const DATA = [
  {x:0, y:0, w:3, h:9, url: "images/toureiffel.jpg", title:"Eiffel Tower", content: "contents/toureiffel.txt"},
  {x:3, y:0, w:4, h:3, url: "images/saintlouis.jpg", title: "Île Saint-Louis", content: "contents/saintlouis.txt"},
  {x:7, y:0, w:3, h:3, url: "images/louvre.jpg", title: "The Louvre", content: "contents/louvre.txt"},
  {x:10, y:0, w:3, h:2, url: "images/pontdesarts.jpg", title: "Pont des arts", content: "contents/pontdesarts.txt"},
  {x:13, y:0, w:3, h:2, url: "images/vosges.jpg", title: "Place des Vosges", content: "contents/vosges.txt"},
  {x:10, y:2, w:6, h:3, url: "images/pompidou.jpg", title: "The Centre Pompidou", content: "contents/pompidou.txt"},
  {x:10, y:5, w:6, h:4, url: "images/orsay.jpg", title: "Orsay museum", content: "contents/orsay.txt"},
  {x:3, y:6, w:3, h:3, url: "images/catacombes.jpg", title: "Catacombs", content: "contents/catacombs.txt"},
  {x:6, y:6, w:4, h:3, url: "images/medicis.jpg", title: "Medicis fountain", content: "contents/medicis.txt"},
  
  {x:3, y:3, w:7, h:3, html: "<div class='paris'>PARIS</div><div class='explanation'>" + EXPLANATION + "</div>"}
]
const MARGIN_X = 16, MARGIN_Y = 16;
let SCALE = 1;
let ISWINOPEN = false;
let JQCURS = null, JQCLICKABLES = [], POINTERPOSITION = [0,0];

// FUNCTIONS:
function  openContent(title, content){
  if (ISWINOPEN) return;
  $("#contentTitle").html(title);
  $("#contentInside").html(content);
  
  $("#content").fadeIn(500);
  ISWINOPEN = true;
  
  $("#gallery").css({
    "-webkit-transition" : 'all 0.5s ease-in-out',
    "-webkit-filter":"blur(6px)"
   });
}


function closeContent(){
  if (!ISWINOPEN) return;
  $("#content").fadeOut(500, function() {
    ISWINOPEN = false;  
  });
  $("#gallery").css({
    "-webkit-transition" : 'all 0.5s ease-in-out',
    "-webkit-filter":"blur(0px)"
   });
}


function addPicture(spec) {
  const width = (spec.w*SCALE) - MARGIN_X,
    height = (spec.h*SCALE) - MARGIN_Y;
  
  const jqVignette = $("<div>").width(width).height(height).addClass('vignette');
  jqVignette.css("margin-top", MARGIN_Y/2);
  jqVignette.css("margin-bottom", MARGIN_Y/2);
  jqVignette.css("margin-right", MARGIN_X/2);
  jqVignette.css("margin-left", MARGIN_X/2);
  jqVignette.css("top", spec.y*SCALE);
  jqVignette.css("left", spec.x*SCALE);
  
  $('#gallery').append(jqVignette);
  
  if (spec.url) {
    const image = new Image();
    image.src=spec.url;
    image.onload = function() {
      const jqcv = $('<canvas>');
      jqcv.css("-webkit-filter","grayscale(1)");
      const cv = jqcv.get(0);
      cv.width = width, cv.height = height;
      const ctx = cv.getContext('2d');
      ctx.drawImage(image, 0,0, image.width, image.height,0,0,width, height);
      jqVignette.append(jqcv);
      
      jqVignette.click(function() {
         $.ajax({
           url: spec.content,
           dataType: "html",
           success: function(data){
           openContent(spec.title, data); 
           }
         });
      });

      JQCLICKABLES.push(jqVignette);
    }
  } //end if spec.url
  if (spec.title) {
    const jqText = $("<div></div>").html(spec.title).addClass('titre');
    jqText.css("bottom", height/8);
    jqVignette.append(jqText);
  }
  if (spec.html) {
    jqVignette.html(spec.html);
  }
}


function updatePointerPosition(x,y){
  POINTERPOSITION[0] = x;
  POINTERPOSITION[1] = y;
  JQCURS.css("left", Math.round(POINTERPOSITION[0]).toString()+'px');
  JQCURS.css("top",  Math.round(POINTERPOSITION[1]).toString()+'px');
}


const STABI = { //stabilizer
  sensibility: 0.003,
  am: 0.8,//0.9,
  pow: 1.8,

  t: Date.now(),
  speed: [0,0],
  speedAm: [0,0],
  rxy: [0,0],
  xy: [window.innerWidth/2, window.innerHeight/2],
  mouseClickEnabled: true
};


function callbackHeadMove(mv){
  const x = window.innerWidth/2, y=window.innerHeight/2;
  const am = STABI.am;

  const t = Date.now();
  const dt = Math.min(t-STABI.t, 50);
  STABI.t = t;

  if (Math.abs(mv.dRx)>200 || Math.abs(mv.dRy)>200){
    console.log('Invalid value');
    return;
  }

  // compute speed:
  STABI.speed[0] = -Math.pow(Math.abs(mv.dRx),STABI.pow) * Math.sign(mv.dRx),
  STABI.speed[1] = -Math.pow(Math.abs(mv.dRy),STABI.pow) * Math.sign(mv.dRy);

  // amortize speed:
  STABI.speedAm[0] = STABI.speedAm[0]*am+(1-am) * STABI.speed[0],
  STABI.speedAm[1] = STABI.speedAm[1]*am+(1-am) * STABI.speed[1];
  
  // save position:
  STABI.rxy[0] = mv.dRx,
  STABI.rxy[1] = mv.dRy;
  
  // apply amortized speed:
  STABI.xy[0] += STABI.sensibility*dt*Math.pow(STABI.speedAm[1], 2.)*Math.sign(STABI.speedAm[1]);
  STABI.xy[1] -= STABI.sensibility*(window.innerWidth/window.innerHeight)*dt*Math.pow(STABI.speedAm[0], 2.)*Math.sign(STABI.speedAm[0]);

  STABI.xy[0] = Math.max(0, STABI.xy[0]);
  STABI.xy[0] = Math.min(STABI.xy[0], window.innerWidth-30);

  STABI.xy[1] = Math.max(0, STABI.xy[1]);
  STABI.xy[1] = Math.min(STABI.xy[1], window.innerHeight-30);

  updatePointerPosition(STABI.xy[0],STABI.xy[1]);

  if (mv.expressions[0]>0.5 && STABI.mouseClickEnabled){ //mouth open
    emulateMouseClick(STABI.xy[0],STABI.xy[1]);
    STABI.mouseClickEnabled = false;
    setTimeout(function(){
      STABI.mouseClickEnabled = true;
    }, 500);
  }

  emulateMouseMove(STABI.xy[0],STABI.xy[1]);
} //end callbackMove()


function getPickableAtPosition(x,y){
  const jqPicks = JQCLICKABLES.filter(function(jqClickable){
    const rect = jqClickable.get(0).getBoundingClientRect();
    if (x<rect.left || x>rect.right){
      return false;
    }
    if (y<rect.top || y>rect.bottom){
      return false;
    }
    return true;
  });
  return (jqPicks.length===0) ? false : jqPicks.pop();
}


function emulateMouseClick(x,y){
  const jqClicked = getPickableAtPosition(x,y);
  if (jqClicked){
    jqClicked.click();
  }
}


function emulateMouseMove(x,y){
  if (ISWINOPEN) return;
  const jqUnderCursor = getPickableAtPosition(x,y);
  JQCLICKABLES.forEach(function(jq){
    if (jq===jqUnderCursor){
      jq.addClass('vignetteMouseOver');
    } else {
      jq.removeClass('vignetteMouseOver');
    }
  });
}


// ENTRY POINT:
function main() {
  JQCURS = $("#cursor");
  SCALE = screen.availWidth / 16;
  
  $(document).mousemove(function(event){
    updatePointerPosition(event.pageX, event.pageY);
  });
      
  DATA.forEach(addPicture);

  $("#content").fadeOut(1).click(function(event) {
    event.stopPropagation();
    return false;
  });
  
  $(document).click(function(event){
     if (!ISWINOPEN) return;
     closeContent();
     event.stopPropagation();
     return false;
  }).on("selectstart",function(event){
    event.preventdefault();
    return false;
  });

  HeadControls.init({
    canvasId: 'headControlsCanvas',
    callbackMove: callbackHeadMove,
    callbackReady: function(err){
      if (err){
        console.log('ERROR in index.html: HEAD CONTROLS NOT READY. err =', err);
      } else {
        console.log('INFO in index.html: HEAD CONTROLS ARE READY :)');
      }
      HeadControls.toggle(true);
    },
    NNCPath: '../../neuralNets/', //where to find NN_DEFAULT.json from this path
    animateDelay: 2, //avoid DOM lags
    disableRestPosition: true
  }); //end HeadControls.init params
} //end main()


$('document').ready(main); 
