import { Component, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-animation02',
  templateUrl: './animation02.component.html',
  styleUrls: ['./animation02.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class Animation02Component implements AfterViewInit {
  @Input()text!: string;

  ngAfterViewInit(): void {
    // Wrap every letter in a span
    var textWrapper = document.querySelector('.an-2');
    textWrapper!.innerHTML = textWrapper!.textContent!.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({ loop: true })
      .add({
        targets: '.an-2 .letter',
        opacity: [0, 1],
        easing: "easeInOutQuad",
        duration: 2250,
        delay: (el: any, i: number) => 150 * (i + 1)
      }).add({
        targets: '.an-2',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  }
}