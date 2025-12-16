import { Component, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import anime from 'animejs/lib/anime.es'; 

@Component({
  selector: 'app-animation03',
  templateUrl: './animation03.component.html',
  styleUrls: ['./animation03.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class Animation03Component implements AfterViewInit {
  @Input()text1!: string;
  @Input()text2!: string;
  
  ngAfterViewInit(): void {
    anime.timeline({ loop: true })
      .add({
        targets: '.c2 .word',
        scale: [14, 1],
        opacity: [0, 1],
        easing: "easeOutCirc",
        duration: 800,
        delay: (el: any, i: number) => 800 * i
      }).add({
        targets: '.c2',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  }
}