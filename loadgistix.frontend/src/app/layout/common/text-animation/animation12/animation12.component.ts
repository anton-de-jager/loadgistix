import { Component, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import anime from 'animejs/lib/anime.es'; 

@Component({
  selector: 'app-animation12',
  templateUrl: './animation12.component.html',
  styleUrls: ['./animation12.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class Animation12Component implements AfterViewInit {
  @Input()text!: string;
  
  ngAfterViewInit(): void {
    // Wrap every letter in a span
    let textWrapper = document.querySelector('.c2');
    textWrapper!.innerHTML = textWrapper!.textContent!.replace(/\S/g, "<span class='letter' style='display:inline-block;'>$&</span>");

    anime.timeline({ loop: true })
      .add({
        targets: '.c2 .letter',
        translateY: [100, 0],
        translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 1200,
        delay: (el: any, i: number) => 500 + 30 * i
      }).add({
        targets: '.c2 .letter',
        translateY: [0, -100],
        opacity: [1, 0],
        easing: "easeInExpo",
        duration: 1100,
        delay: (el: any, i: number) => 100 + 30 * i
      });
  }
}
