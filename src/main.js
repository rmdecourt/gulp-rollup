import ajax from './libs/utils/ajax';
import has from 'lodash/has';

/**
 * ES5 - "forEach" polyfill for NodeList.
 **/
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function (callback, thisArg) {
      thisArg = thisArg || window;
      for (var i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }
  
  /**
   * Return the total length of a svg circle element.
   *
   * @param   {SVGElement} element  Svg element.
   * @returns {number}              Total length.
   */
  function getCircleLength(element) {
    var r = element.getAttribute('r');
    var circleLength = 2 * Math.PI * r;
    return circleLength;
  }
  
  /**
   * Return the total length of a svg line element.
   *
   * @param   {SVGElement} element  Svg element.
   * @returns {number}              Total length.
   */
  function getLineLength(element) {
    console.log(element);
    return element.getTotalLength();
  }
  
  /**
   *  Splits the text into spans for stagger animation (Typewriter effect).
   *
   * @param {String} selector   Css selector.
   * @param {String} className  Class name used for animation.
   */
  function splitText(selector, className) {
    var texts = document.querySelectorAll(selector);
    texts.forEach(function (element) {
      var text = element.innerHTML.replace(/\<br\/?\>/g, '~').trim().split('');
      element.innerHTML = "";
      text.forEach(function (letter) {
        if (letter === '~') {
          // includes a line break.
          element.appendChild((document.createElement('br')));
        } else {
          // includes a span.
          var span = document.createElement('span');
          span.textContent = letter;
          if (letter !== ' ') {
            span.classList.add(className);
          }
          element.appendChild(span);
        }
      });
    });
  }
  
  /**
   * Prepare an SVG element for drawing.
   *
   * @param {string}  selector  Selector for an svg element.
   * @param {bool}    reverse   Change de drawing direction.
   */
  function setElementStrokeDashoffset(selector, reverse) {
    var strokes = document.querySelectorAll(selector);
    for (var i = strokes.length - 1; i >= 0; i--) {
      var stroke = strokes[i];
      var strokeLength = null;
      if (stroke.tagName === 'circle') {
        strokeLength = getCircleLength(stroke);
      } else {
        strokeLength = getLineLength(stroke);
      }
      stroke.style.strokeDasharray = strokeLength + ' ' + strokeLength;
      stroke.style.strokeDashoffset = strokeLength;
      if (reverse) {
        stroke.style.strokeDashoffset = strokeLength * -1;
      }
    }
  }
  
  /**
   * Prepare the DOM before animation can start.
   */
  function preAnimation() {
    setElementStrokeDashoffset('.fixed__draw', false);
    setElementStrokeDashoffset('.step-1__draw--circle-1', true);
    setElementStrokeDashoffset('.step-2__draw', false);
    splitText('.step-2__text--note', 'step-2__text-char');
    splitText('.step-3__text--note', 'step-3__text-char');
  }
  
  
  /**
   * Opening Timeline
   *
   * @returns {TimelineMax}  Opening timeline.
   */
  function openingTimeline() {
    var timeline = new TimelineMax();
    timeline
      .set('.fixed', {display: 'block'})
    return timeline;
  }
  
  /**
   * Returns the Step-1 animation timeline.
   * @returns {TimelineMax} Step-1 animation timeline.
   */
  function step1Timeline() {
    var timeline = new TimelineMax();
    timeline
      .set('.fixed', {display: 'block', alpha: 1})
      .set('.step-1', {display: 'block', alpha: 1})
      .staggerTo('.fixed__draw', .3, {strokeDashoffset: 0, alpha: 1}, 0.05)
      .to('.fixed__graphics', .5, {alpha: 1}, 0.1)
      .fromTo('.step-1__billboard', .3, {alpha: 0}, {alpha: .7})
      .to('.step-1__billboard', .01, {alpha: .2})
      .to('.step-1__billboard', .02, {alpha: .6})
      .to('.step-1__billboard', .01, {alpha: .2})
      .to('.step-1__billboard', .03, {alpha: 1})
      .to('.step-1__billboard', .08, {alpha: .6})
      .to('.step-1__billboard', .01, {alpha: .2})
      .to('.step-1__billboard', .03, {alpha: 1})
      .to('.step-1__billboard', .08, {alpha: .6})
      .to('.step-1__billboard', .05, {alpha: .2})
      .to('.step-1__billboard', .1, {alpha: 1})
      .to('.step-1__billboard', .3, {alpha:0}, '+=2.5')
      .to('.step-1__display', .3, {alpha:0})
      .set('.fixed__graphic', {alpha:0})
    return timeline;
  }
  
  /**
   * Returns the Step-2 animation timeline.
   * @returns {TimelineMax} Step-2 animation timeline.
   */
  function step2Timeline() {
    var timeline = new TimelineMax();
    timeline
      .to('.steps', .3, {x: -160})
      .to('.fixed__graphic', .3,{alpha:1})
      .staggerTo('.step-2__draw--hack', 2, {strokeDashoffset: 0, alpha: 1}, 0.05)
      .staggerTo('.step-2__draw--future', .4, {strokeDashoffset: 0, alpha: 1}, 0.05)
      .from('.step-2__wrapper', .3, {width:0})
      .to({}, 2, {})
      .to('.fixed__graphic', .3, {alpha:0})
    return timeline;
  }
  
  /**
   * Returns the Step-3 animation timeline.
   * @returns {TimelineMax} Step-3 animation timeline.
   */
  function step3Timeline() {
    var timeline = new TimelineMax();
    timeline
      // .call(function () {
      //   // setElementStrokeDashoffset('.fixed__draw', false);
      //   document.querySelector('.fixed__logo').classList.add('halign-center')
      // })
      // .set('.fixed__logo', {alpha:1})
      .to('.steps', .3, {x: -320})
      .to('.fixed', .3,{alpha: 1})
      .to('.fixed__graphic', .3, {alpha: 1})
      // .staggerTo('.fixed__draw', 0.3, {strokeDashoffset: 0, alpha: 1}, 0.05, '+=.5')
      .fromTo('.step-3__image', .3, {alpha: 0}, {alpha: .7})
      .to('.step-3__image', .01, {alpha: .2})
      .to('.step-3__image', .02, {alpha: .6})
      .to('.step-3__image', .01, {alpha: .2})
      .to('.step-3__image', .03, {alpha: 1})
      .to('.step-3__image', .08, {alpha: .6})
      .to('.step-3__image', .01, {alpha: .2})
      .to('.step-3__image', .03, {alpha: 1})
      .to('.step-3__image', .08, {alpha: .6})
      .to('.step-3__image', .05, {alpha: .2})
      .to('.step-3__image', .1, {alpha: 1})
      .staggerFrom('.step-3__text', .3, {y: 30}, .1)
      .fromTo('.step-3__display .display__edge', .08, {alpha: 0}, {alpha: 1})
      .set('.step-3__display .display__edge--left', {marginRight: 0})
      .fromTo('.step-3__display .display__content', .3, {width: 0}, {width: 140})
      .fromTo('.box-button__text', .1, {letterSpacing: '5px', textIndent: '0px', alpha: 0}, {
        letterSpacing: '1px',
        textIndent: '1px',
        alpha: 1
      }, '+=.3')
      .fromTo('.box-button__line-bottom-left', .2, {scaleX: 0}, {scaleX: 1})
      .fromTo('.box-button__line-left', .2, {scaleY: 0}, {scaleY: 1})
      .fromTo('.box-button__line-top', .2, {scaleX: 0}, {scaleX: 1})
      .fromTo('.box-button__line-right', .2, {scaleY: 0}, {scaleY: 1})
      .fromTo('.box-button__line-bottom-right', .2, {scaleX: 0}, {scaleX: 1})
      .from('.box-button', .3, {backgroundColor: 'none'})
      .to('.box-button', .3, {boxShadow: '0 0 20px #ED145B'})
      .to('.box-button', .2, {boxShadow: '0 0 10px #ED145B', yoyo: true, repeat: 0})
  
    return timeline;
  }
  
  /**
   * Returns the closing animation timeline.
   * @returns {TimelineMax} Closing animation timeline.
   */
  function closingTimeline() {
    var timeline = new TimelineMax();
    timeline
      .to('.step-3', .4, {alpha: 0}, '+=1')
      .to('.fixed, .background', .4, {alpha: 0})
    return timeline;
  }
  
  /**
   * initializes the master animation timeline.
   */
  function main() {
    // var counter = 0;
  
    var master = new TimelineMax({repeat: 0});
    master
      .add(openingTimeline(),10)
      .add(step1Timeline())
      .add(step2Timeline(), '-=.5')
      .add(step3Timeline())
    // Descomentar em caso de repetição
    // .call(function () {
    //   if (counter >= 1) {
    //     master.pause();
    //   } else {
    //     counter++;
    //   }
    // })
    // .add(closingTimeline())
  
    console.log(master.totalDuration());
  }
  
  window.addEventListener('load', function () {
    preAnimation();
    main();
    ajax();
  })

  (() => {
    console.log('xxx');
    has({a:1,b:0},'c');
  })()
  