import { Component, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import anime from 'animejs/lib/anime.es'; 

@Component({
  selector: 'app-animation10',
  templateUrl: './animation10.component.html',
  styleUrls: ['./animation10.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class Animation10Component implements AfterViewInit {
  @Input()text!: string;
  
  ngAfterViewInit(): void {
  // Wrap every letter in a span
let textWrapper = document.querySelector('.c2 .letters');
textWrapper!.innerHTML = textWrapper!.textContent!.replace(/\S/g, "<span class='letter' style='display:inline-block;'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.c2 .line',
    scaleY: [0,1],
    opacity: [0.5,1],
    easing: "easeOutExpo",
    duration: 700
  })
  .add({
    targets: '.c2 .line',
    translateX: [0, document.querySelector('.c2 .letters')!.getBoundingClientRect().width + 10],
    easing: "easeOutExpo",
    duration: 700,
    delay: 100
  }).add({
    targets: '.c2 .letter',
    opacity: [0,1],
    easing: "easeOutExpo",
    duration: 600,
    offset: '-=775',
    delay: (el: any, i: number) => 34 * (i+1)
  }).add({
    targets: '.c2',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });
  }
}