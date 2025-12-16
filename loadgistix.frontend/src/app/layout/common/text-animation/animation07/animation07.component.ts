import { Component, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import anime from 'animejs/lib/anime.es'; 

@Component({
  selector: 'app-animation07',
  templateUrl: './animation07.component.html',
  styleUrls: ['./animation07.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class Animation07Component implements AfterViewInit {
  @Input()text!: string;
  
  ngAfterViewInit(): void {
    // Wrap every letter in a span
    let textWrapper = document.querySelector('.c2 .letters');
    textWrapper!.innerHTML = textWrapper!.textContent!.replace(/\S/g, "<span class='letter' style='display:inline-block;'>$&</span>");  // do not forget this display:inline-block style here

    anime.timeline({ loop: true })
      .add({
        targets: '.c2 .letter',
        translateY: ["1.1em", 0],
        translateX: ["0.55em", 0],
        translateZ: 0,
        rotateZ: [180, 0],
        duration: 750,
        easing: "easeOutExpo",
        delay: (el: any, i: number) => 50 * i
      }).add({
        targets: '.c2',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  }
}