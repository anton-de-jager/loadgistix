import { Component, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import anime from 'animejs/lib/anime.es'; 

@Component({
  selector: 'app-animation08',
  templateUrl: './animation08.component.html',
  styleUrls: ['./animation08.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class Animation08Component implements AfterViewInit {
  @Input()text!: string;
  
  ngAfterViewInit(): void {
    // Wrap every letter in a span
    let textWrapper = document.querySelector('.c2 .letters');
    textWrapper!.innerHTML = textWrapper!.textContent!.replace(/\S/g, "<span class='letter' style='display:inline-block;'>$&</span>");

    anime.timeline({ loop: true })
      .add({
        targets: '.c2 .letter',
        scale: [0, 1],
        duration: 1500,
        elasticity: 600,
        delay: (el: any, i: number) => 45 * (i + 1)
      }).add({
        targets: '.c2',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  }
}