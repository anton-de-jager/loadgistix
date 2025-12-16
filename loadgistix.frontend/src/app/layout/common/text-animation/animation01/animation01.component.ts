import { Component, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-animation01',
  templateUrl: './animation01.component.html',
  styleUrls: ['./animation01.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class Animation01Component implements AfterViewInit {
  @Input()text!: string;

  ngAfterViewInit(): void {
    // Wrap every letter in a span
    const textWrapper = document.querySelector('.an-1');
    textWrapper!.innerHTML = textWrapper!.textContent!.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({ loop: true })
      .add({
        targets: '.an-1 .letter',
        scale: [4, 1],
        opacity: [0, 1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 950,
        delay: (el: any, i: number) => 70 * i
      }).add({
        targets: '.an-1',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });

  }
}
