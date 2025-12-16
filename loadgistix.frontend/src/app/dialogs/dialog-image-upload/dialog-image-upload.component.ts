import { Component, Inject, OnDestroy, inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
//import { Dimensions, ImageCroppedEvent, ImageTransform } from './interfaces/index';
import { Dimensions, ImageTransform } from './interfaces/index';
import { base64ToFile, urlToFile } from './utils/blob.utils';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ImageCroppedEvent, ImageCropperModule, LoadedImage } from 'ngx-image-cropper';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog-image-upload',
  templateUrl: './dialog-image-upload.component.html',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule, MatMenuModule, NgIf, ImageCropperModule, MatSliderModule],
  encapsulation: ViewEncapsulation.None
})
export class DialogImageUploadComponent implements OnDestroy {
  private _unsubscribeAll = new Subject<void>();
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = true;
  transform: ImageTransform = {};
  roundCropper = false;
  loadingImage: boolean = false;
  imagesFolder: string = '';
  savedImage: any = null;

  constructor(
    public dialogRef: MatDialogRef<DialogImageUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.roundCropper = data.roundCropper;
    this.croppedImage = data.croppedImage;
    this.imagesFolder = data.imagesFolder;
    this.savedImage = data.savedImage;
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  captureImage() {
    let options = {
      quality: 90,
      allowEditing: true,
      source: CameraSource.Prompt,
      resultType: CameraResultType.Uri
    }
    Camera.getPhoto(options).then(async imageData => {
      this.loadingImage = true;
      const imageFile = await urlToFile(imageData.webPath, 'image.jpg', 'image/jpeg');
      this.fileChangeEvent({ target: { files: [imageFile] } });
    }, (err) => {
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  async imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = await this.blobToBase64(event.blob!);
    this.loadingImage = false;
  }

  async imageLoaded(image: LoadedImage) {
    this.croppedImage = await this.blobUrlToBase64(image.transformed.objectUrl);
    this.showCropper = true;
  }

  blobToBase64(blob: Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  blobUrlToBase64(blobUrl: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';

      xhr.onload = function () {
        reader.readAsDataURL(xhr.response);
        reader.onloadend = function () { resolve(reader.result as string); }
        reader.onerror = function (ev) { reject(`Exception reading Blob > xhr.response: ${xhr.response}\nLast Progress Event: ${ev}`); };
      };
      xhr.onerror = function (ev) { reject(`Exception fetching Blob > BlobUrl: ${blobUrl}\nLast Progress Event: ${ev}`); };

      xhr.open('GET', blobUrl);
      xhr.send();
    });
  }

  cropperReady(sourceImageDimensions: Dimensions) {
  }

  loadImageFailed() {
    this.loadingImage = true;
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }


  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomChange(event: any) {
    let value = event.target.value;
    this.scale = value;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }

  cancel() {
    this.dialogRef.close(null);
  }
  submit() {
    this.dialogRef.close(this.croppedImage);
  }
}
