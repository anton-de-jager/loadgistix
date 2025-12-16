import { Component, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import anime from 'animejs/lib/anime.es'; 

@Component({
  selector: 'app-animation05',
  templateUrl: './animation05.component.html',
  styleUrls: ['./animation05.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class Animation05Component implements AfterViewInit {
  @Input()text1!: string;
  @Input()text2!: string;
  @Input()text3!: string;
  @Input()text4!: string;
  @Input()text5!: string;
  @Input()text6!: string;
  
  ngAfterViewInit(): void {
    anime({
      targets: '.c1 .el',
      direction: 'alternate',
      loop: true,
      scale: {
        value: '1.4',
        delay: function (el: any, i: number, l: any) {
          return i * 800;
        },
        duration: 700
      }

    });
  }
}