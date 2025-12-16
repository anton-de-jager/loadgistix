import { Component, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import anime from 'animejs/lib/anime.es'; 

@Component({
  selector: 'app-animation06',
  templateUrl: './animation06.component.html',
  styleUrls: ['./animation06.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class Animation06Component implements AfterViewInit {
  @Input()text!: string;
  
  ngAfterViewInit(): void {
    let textWrapper = document.querySelector('.c1');
    textWrapper!.innerHTML = textWrapper!.textContent!.replace(/\S/g, "<span class='el' style='display:inline-block;'>$&</span>");

    anime.timeline({ loop: true })
      .add({
        targets: '.c1 .el',
        translateY: ["1.1em", 0],
        translateZ: 0,
        duration: 750,
        delay: (el: any, i: number) => 100 * i
      }).add({
        targets: '.c1',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 100
      });
  }
}