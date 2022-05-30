import {initShaderProgram} from './shader.js'

import { vsSource } from "./shaders/vertex.js"
import { fsSource } from "./shaders/fragment.js"

import { drawRectangle, drawLine } from './helpers/draw.js'
import { draw_minimap } from './game/minimap.js'
import { draw_projection } from './game/projection.js'

var keyDown = false;

import {
  toggle_game_wireframe, 
  player_pos, 
  player_speed,
  set_player_pos, 
  player_angle, 
  player_rotate_speed,
  set_player_angle,
  player_collider,
  game_map,
  ray_count,
  set_ray_count,
  ray_fov,
  set_ray_fov,
  ray_lengths,
  initialize_ray_lengths,
  set_ray_lengths
} from './vars.js'

function main() {
  const canvas = document.querySelector("#glCanvas");
  canvas.width    = 2000; // set the canvas resolution
  canvas.height   = 2000;
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Compile, and bind shaders
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  initialize_ray_lengths(ray_count);

  var startTime = 0;
  // Draw Loop to be called every frame
  function gameLoop(time) {
    // Clear screen
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Calculate frame time
    var frameTime = (time - startTime); // Frame time in seconds
    startTime = time;
    document.title = "[" + String(1000 / frameTime | 0) + "] Aidan Mackey - Ray Casting Engine (JavaScript)";
    //console.log(frameTime);

    draw_projection({x: -1.0, y: 1.0},{x: 1.0, y: -1.0}, shaderProgram, gl);
    draw_minimap({x: -1.0, y: 1.0},{x: -0.5, y: 0.0}, shaderProgram, gl);

    check_key_presses()

    window.requestAnimationFrame(gameLoop);
  }

  gameLoop(0);
}

function check_key_presses() {
  
  window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
      return; // Do nothing if the event was already processed
    }

    // console.log(event.key)

    if(!keyDown)
    switch (event.key) {
      case " ":
        toggle_game_wireframe()
        break;

      case "ArrowUp":
        if(game_map[player_collider.y | 0][player_pos.x | 0] != 1) { // No collision on y axis
          set_player_pos({
            x: player_pos.x, 
            y: player_pos.y + player_speed * Math.cos(player_angle)
          })
        } 

        if(game_map[player_pos.y | 0][player_collider.x | 0] != 1) { // No collision on x axis
          set_player_pos({
            x: player_pos.x + player_speed * Math.sin(player_angle), 
            y: player_pos.y
          })
        }

        keyDown = true;
        break;

      case "ArrowDown":
        set_player_pos({
          x: player_pos.x - player_speed * Math.sin(player_angle), 
          y: player_pos.y - player_speed * Math.cos(player_angle)
        })
        keyDown = true;
        break;

      case "ArrowLeft":
        set_player_angle(player_angle + player_rotate_speed);
        keyDown = true;
        if(player_angle >= 2 * Math.PI) {set_player_angle(player_angle - (2 * Math.PI))}
        break;
        
        case "ArrowRight":
            set_player_angle(player_angle - player_rotate_speed)
            if(player_angle < 0) {set_player_angle(player_angle + (2 * Math.PI))}
            keyDown = true;
        break;

        case "]":
          set_ray_fov(ray_fov - Math.PI / 10)
          if(ray_fov < 0) {set_ray_fov(0);}
          break;

        case "[":
          set_ray_fov(ray_fov + Math.PI / 10)
          if(ray_fov > 2 * Math.PI) {set_ray_fov(2 * Math.PI);}
          break;

        case "=":
          set_ray_count(ray_count + 1)
          // if(ray_fov > 2 * Math.PI) {set_ray_fov(2 * Math.PI);}
          break;

        case "-":
          set_ray_count(ray_count - 1)
          // if(ray_fov > 2 * Math.PI) {set_ray_fov(2 * Math.PI);}
          break;
      default:
        return;
    }
  
    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  }, true);


  //console.log(player_collider.y, player_collider.x)
  
  if(keyDown)
  document.addEventListener("keyup", function(event) {
    switch (event.key) {
      case " ":
        keyDown = false;
        break;
      case "ArrowUp":
        keyDown = false;
        break;
      case "ArrowDown":
        keyDown = false;
        break;
      case "ArrowLeft":
        keyDown = false;
        break;
      case "ArrowRight":
        keyDown = false;
        break;
    }
  });
}

window.onload = main;
