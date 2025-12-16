import { Component, AfterViewInit, Input } from '@angular/core';
import anime from 'animejs/lib/anime.es';

@Component({
  selector: 'app-moving-letters',
  templateUrl: './moving-letters.component.html',
  styleUrls: ['./moving-letters.component.scss'],
  standalone: true
})
export class MovingLettersComponent implements AfterViewInit {
  @Input() text!: string;

  textWrapper = document.querySelector('.ml9 .letters');

  constructor() {

  }
  ngAfterViewInit(): void {
    if (this.textWrapper) {
      this.textWrapper!.innerHTML = this.textWrapper!.textContent!.replace(/\S/g, "<span class='letter'>$&</span>");
    }

    anime.timeline({ loop: true })
      .add({
        targets: '.ml9 .letters',
        scale: [0, 1],
        duration: 1500,
        elasticity: 600,
        delay: (el: any, i: number) => 45 * (i + 1)
      }).add({
        targets: '.ml9',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  }

}
