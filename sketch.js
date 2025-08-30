//constants/globals
var arr = Array(0);
const container = document.querySelector(".canvas-container");
const width = container ? container.offsetWidth : window.innerWidth;
const height = container ? container.offsetHeight : window.innerHeight - 200;
var thick = 20;
var len_arr = Math.floor((width - thick) / thick);
var sorted_arr = Array(0);
var start_sorting = false;
var sorting_paused = false;
var frame_rate_val = 40;
var timer_arr = [];
var time_taken = 0;
var pause = false;
//each bar has following properties
class Element {
  constructor(val) {
    this.val = val;
    this.compare = false;
    this.swap = false;
    this.sub_arr = false;
  }

  draw(i, isSorted = false) {
    // Enhanced bar design with better visual distinction
    noStroke();

    // Determine bar color based on state - more distinct but still elegant
    let barFill;
    let borderColor = null;

    if (this.compare == true) {
      // Comparing state - vibrant cyan for better visibility
      barFill = color(0, 200, 255, 255);
      borderColor = color(0, 150, 200, 255);
    } else if (this.swap == true) {
      // Swapping state - vibrant red-orange for clear indication
      barFill = color(255, 100, 50, 255);
      borderColor = color(255, 70, 30, 255);
    } else if (isSorted) {
      // Sorted state - bright gold/yellow for final position
      barFill = color(255, 215, 0, 255);
      borderColor = color(255, 180, 0, 255);
    } else {
      // Default state - purple-blue for unsorted bars
      barFill = color(120, 100, 220, 255);
      borderColor = color(100, 80, 200, 255);
    }

    // Draw bar with smooth rounded corners
    const x = i * thick;
    const y = height - this.val;
    const barWidth = thick;
    const barHeight = this.val;
    const cornerRadius = min(6, barWidth / 4);

    // Draw subtle border for better distinction
    if (borderColor) {
      stroke(borderColor);
      strokeWeight(1);
      fill(barFill);
      rect(x, y, barWidth, barHeight, cornerRadius, cornerRadius, 0, 0);
      noStroke();
    } else {
      fill(barFill);
      rect(x, y, barWidth, barHeight, cornerRadius, cornerRadius, 0, 0);
    }
  }
}

//function name holder
const algo_dict = {
  bubbleSort: bubbleSort,
  selectionSort: selectionSort,
  mergeSort: mergeSort,
  quickSort: quickSortLomuto,
};
const timer_algo = {
  bubbleSort: bubbleSort_t,
  selectionSort: selectionSort_t,
  mergeSort: mergeSort_t,
  quickSort: quickSortLomuto_t,
};

function setup() {
  print_hello();
  // Create canvas with original dimensions
  const container = document.querySelector(".canvas-container");
  // Get computed style padding of container
  const style = window.getComputedStyle(container);
  const paddingLeft = parseInt(style.paddingLeft) || 0;
  const paddingRight = parseInt(style.paddingRight) || 0;
  const paddingTop = parseInt(style.paddingTop) || 0;
  const paddingBottom = parseInt(style.paddingBottom) || 0;

  let width = container
    ? container.offsetWidth - paddingLeft - paddingRight
    : window.innerWidth;
  let height = container
    ? container.offsetHeight - paddingTop - paddingBottom
    : window.innerHeight - 200;
  const canvas = createCanvas(width, height);
  canvas.parent(container);

  // Log container and canvas sizes for debugging
  console.log("Container size:", container.offsetWidth, container.offsetHeight);
  console.log("Canvas size:", canvas.width, canvas.height);

  // Handle window resize to update canvas size dynamically
  window.addEventListener("resize", () => {
    let newWidth = container.offsetWidth;
    let newHeight = container.offsetHeight;
    resizeCanvas(newWidth, newHeight);
    width = newWidth;
    height = newHeight;
    len_arr = Math.floor(width / thick);
    arr = [];
    sorted_arr = [];
    setup_arr();
  });

  var btns = document.querySelectorAll(".clickable"); //all buttons
  // console.log(btns);
  for (btn of btns) {
    btn.addEventListener("click", function () {
      // console.log("clicked", this.id); debugging button
      if (this.id == "reset") {
        //gets a new arr
        //styles the element to default
        arr = [];
        sorted_arr = [];
        start_sorting = false;
        sorting_paused = false;
        frameRate(frame_rate_val);
        setup_arr();
        document.getElementById("time").innerHTML = "Time: 0us";
        document.getElementById("frm").value = "40";
      } else if (this.id == "start") {
        if (!start_sorting) {
          start_sorting = true;
          sorting_paused = false;
          start_sort(current_algo);
          time_this_algo(current_algo);
          frameRate(frame_rate_val);
        } else if (start_sorting && sorting_paused) {
          sorting_paused = false;
          frameRate(frame_rate_val);
        }
      } else if (this.id == "stop") {
        if (start_sorting && !sorting_paused) {
          sorting_paused = true;
          frameRate(0);
        }
      } else {
        if (this.id != "") {
          if (start_sorting == false) {
            //if no other sorting algo was selected
            start_sorting = true;
            current_algo = this.id;
            updateAlgorithmDisplay(this.id);
            start_sort(this.id);
            time_this_algo(this.id);
            frameRate(frame_rate_val);
          } else {
            //if other algo was running
            //reset and run this new algo
            arr = [];
            sorted_arr = [];
            start_sorting = false;
            sorting_paused = false;
            frameRate(frame_rate_val);
            setup_arr();
            document.getElementById("time").innerHTML = "Time:0us";
            start_sorting = true;
            current_algo = this.id;
            updateAlgorithmDisplay(this.id);
            time_this_algo(this.id);
            start_sort(this.id);
          }
        }
      }

      return true;
    });
  }
  slider_control(); //slide control
  setup_arr(); //create the arr
  current_algo = "bubbleSort"; // default algorithm
  updateAlgorithmDisplay(current_algo);
  // console.log(frameRate());
}

function updateAlgorithmDisplay(algoId) {
  const algoNames = {
    bubbleSort: "Bubble Sort",
    selectionSort: "Selection Sort",
    mergeSort: "Merge Sort",
    quickSort: "Quick Sort",
  };
  document.getElementById("current-algo").innerHTML = algoNames[algoId];
}
function time_this_algo(algo) {
  //timer start
  var t0 = window.performance.now();
  timer_loop = timer_algo[algo](timer_arr);
  var t1 = window.performance.now();
  console.log(t1 - t0);
  time = (t1 - t0) * 1000;
  time = Math.round(time);
  t1 = 0;
  t0 = 0;
  if (time == 0) {
    time = 0.01;
  }
  if (time < 1000) {
    document.getElementById("time").innerHTML = "Time: " + String(time) + "us";
  } else {
    document.getElementById("time").innerHTML =
      "Time: " + String(Math.round(time / 1000)) + "ms";
  }
  //timer stop
  //store the diff
}
function slider_control() {
  var size_slider = document.getElementById("data_size");
  size_slider.oninput = function () {
    thick = 62 - size_slider.value;
    //higher the slider more the bars
    len_arr = Math.floor(width / thick);
    //reset everything
    arr = [];
    sorted_arr = [];
    start_sorting = false;
    frameRate(frame_rate_val);
    setup_arr();
    // console.log(arr);
  };
  var frm_slider = document.getElementById("frm");
  // console.log(frm_slider);
  frm_slider.oninput = function () {
    //cant cange vals superfast
    //so we do according to range of slider
    if (this.value == 0) {
      frame_rate_val = 0;
      frameRate(0);
    }
    if (1 < this.value && this.value <= 10) {
      if (frameRate() != 5) {
        frame_rate_val = 5;
        frameRate(5);
      }
    }
    if (11 < this.value && this.value <= 20) {
      if (frameRate() != 20) {
        frame_rate_val = 20;
        frameRate(20);
      }
    }
    if (21 < this.value && this.value <= 30) {
      if (frameRate() != 40) {
        frame_rate_val = 40;
        frameRate(40);
      }
    }
    if (35 < this.value && this.value <= 40) {
      if (frameRate() != 60) {
        frame_rate_val = 60;
        frameRate(60);
      }
    }
  };
}
function setup_arr() {
  for (let i = 0; i < len_arr; i++) {
    // Adjust max height to leave margin at bottom
    const maxHeight = height - thick * 2;
    push_value = random(thick, maxHeight > thick ? maxHeight : thick); //ellipse height
    arr.push(new Element(push_value));
    sorted_arr.push(push_value);
    timer_arr.push(new Element(push_value));
  }
  sort_the_arr(sorted_arr);
}
function start_sort(algo) {
  loop_counter = algo_dict[algo](arr);
}
function draw() {
  background(0);

  if (start_sorting == true) {
    loop_counter.next();
  }
  draw_arr();
}

function draw_arr() {
  for (let i = 0; i < arr.length; i++) {
    if (sorted_arr[i] == arr[i].val) {
      arr[i].draw(i, true); // Pass true to indicate sorted state
    } else {
      arr[i].draw(i);
    }
    // Debug: Log bar position and size to check overflow
    const x = i * thick;
    const y = height - arr[i].val;
    const barWidth = thick;
    const barHeight = arr[i].val;
    console.log(
      `Bar ${i}: x=${x}, y=${y}, width=${barWidth}, height=${barHeight}`
    );
    // Reset the state flags after drawing
    arr[i].compare = false;
    arr[i].swap = false;
  }
}
function sort_the_arr(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
}

function print_hello() {
  console.log("Hellooo human!");
}
