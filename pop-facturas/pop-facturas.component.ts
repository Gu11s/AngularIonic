import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController, AlertController, Platform } from '@ionic/angular';
import { FacturasService } from 'src/app/services/facturas.service';

//File
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';

@Component({
  selector: 'app-pop-facturas',
  templateUrl: './pop-facturas.component.html',
  styleUrls: ['./pop-facturas.component.scss'],
})
export class PopFacturasComponent implements OnInit {

  constructor(private popCtrl: PopoverController,
              private toastCtrl: ToastController,
              private facturaService: FacturasService,
              private alertController: AlertController,
              
              private platform: Platform,
              private file: File,
              private ft: FileTransfer,
              private fileOpener: FileOpener,
              private document: DocumentViewer,
              private transfer: FileTransfer, 
              private files: File
              ) { }

  fileTransfer: FileTransferObject = this.transfer.create();

  ngOnInit() {}

  async presentToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  cambiarEstado(factura)
  {
    //Validar si no esta ya anulada que ya no anule
    this.presentAlertConfirm(factura);
  }

  descargarPDF(factura)
  {
    let downloadUrl = 'https://www.digitalrising.com.gt/wp-content/uploads/2020/04/B53D0777-83CD-4DE1-8C3A-D7FE5B212E3C1.pdf';
    let path = this.file.dataDirectory;
    const transfer = this.ft.create(); //download the file

    transfer.download(downloadUrl, `${path}myfile.pdf`)
      .then(entry => {
        let url = entry.toURL();
        if(this.platform.is('ios')){
          this.document.viewDocument(url,'application/pdf', {});
        } else if(this.platform.is('android')){
          this.fileOpener.open(url, 'application/pdf');
        } else {
          this.fileTransfer.download(downloadUrl, this.files.dataDirectory + 'file.pdf').then((entry) =>
          console.log('download complete: ' + entry.toURL() )
          ), (error)=>{
            console.log(error);
          }
        }
      });
  }

  async presentAlertConfirm(factura) {
    const alert = await this.alertController.create({
      header: 'Anular factura 100',
      message: ' <p>¿Estas seguro de anular la factura?</p>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //no desea anular
            this.popCtrl.dismiss();
          }
        }, {
          text: 'Anular',
          handler: () => {
              //si desea anular factura
              this.facturaService.anularFactura(factura);
              this.popCtrl.dismiss();
              this.presentToast('Anulaste la factura');
          }
        }
      ]
    });

    await alert.present();
  }



}
