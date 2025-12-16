import { Component, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import anime from 'animejs/lib/anime.es'; 

@Component({
  selector: 'app-animation04',
  templateUrl: './animation04.component.html',
  styleUrls: ['./animation04.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true
})
export class Animation04Component implements AfterViewInit {
  @Input()text1!: string;
  @Input()text2!: string;
  @Input()text3!: string;
  
  ngAfterViewInit(): void {
    interface AnimationDefinition { opacityIn: number[], scaleIn: number[], scaleOut: number, durationIn: number, durationOut: number, delay: number };
    const anDef: AnimationDefinition = {
      opacityIn: [0, 1],
      scaleIn: [0.2, 1],
      scaleOut: 3,
      durationIn: 800,
      durationOut: 600,
      delay: 500
    };

    anime.timeline({ loop: true })
      .add({
        targets: '.anDef .letters-1',
        opacity: anDef.opacityIn,
        scale: anDef.scaleIn,
        duration: anDef.durationIn
      }).add({
        targets: '.anDef .letters-1',
        opacity: 0,
        scale: anDef.scaleOut,
        duration: anDef.durationOut,
        easing: "easeInExpo",
        delay: anDef.delay
      }).add({
        targets: '.anDef .letters-2',
        opacity: anDef.opacityIn,
        scale: anDef.scaleIn,
        duration: anDef.durationIn
      }).add({
        targets: '.anDef .letters-2',
        opacity: 0,
        scale: anDef.scaleOut,
        duration: anDef.durationOut,
        easing: "easeInExpo",
        delay: anDef.delay
      }).add({
        targets: '.anDef .letters-3',
        opacity: anDef.opacityIn,
        scale: anDef.scaleIn,
        duration: anDef.durationIn
      }).add({
        targets: '.anDef .letters-3',
        opacity: 0,
        scale: anDef.scaleOut,
        duration: anDef.durationOut,
        easing: "easeInExpo",
        delay: anDef.delay
      }).add({
        targets: '.anDef',
        opacity: 0,
        duration: 500,
        delay: 500
      });
  }
}