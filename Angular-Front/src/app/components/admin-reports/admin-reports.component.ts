import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {BookService} from "../../service/book.service";
import * as jsPDF from 'jspdf';
import * as html2canvas from "html2canvas";
import 'jspdf-autotable';
import {style} from "@angular/animations";


@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css']
})
export class AdminReportsComponent implements OnInit {
  user:any;
  totalFine=0;
  fines:any;
  message:String;
  searchText = {
    enteredText:""
  };
  constructor(private authService:AuthService,private router:Router,private bookService:BookService) { }

  ngOnInit() {
    if (!this.authService.isLoggedIn()){
      this.router.navigate(['']);
    }
    else{
      this.authService.getAdminHome().subscribe(res=>{
        this.user = res.user;

        if(this.user.type=="Student"){
          this.router.navigate(['student-home']);
        }
      });

      this.bookService.filterBorrowDetails(this.searchText).subscribe(res=>{
        if(res.msg==""){
          this.message="No search results found";
        }
        else{
          this.message="";
          this.fines = res.msg;
          let i;
          for (i = 0; i < this.fines.length; i++) {
            if (this.fines[i].fine!=null){
              this.totalFine = this.totalFine + parseInt(this.fines[i].fine);
            }
          }
        }
      });
    }

  }

  generateAllFines(){
    this.totalFine=0;


    let columns = [
      {title: "Index/Reg No.", dataKey: "index"},
      {title: "Name", dataKey: "name"},
      {title: "Contact", dataKey: "contact"},
      {title: "ISBN", dataKey: "isbn"},
      {title: "Title", dataKey: "title"},
      {title: "Borrowed Date", dataKey: "bdate"},
      {title: "Overdue Date", dataKey: "odate"},
      {title: "Fine (Rs.)", dataKey: "fine"},
    ];
    let rows = [];

    let i;
    for (i = 0; i < this.fines.length; i++) {
      if (this.fines[i].fine!=null){
        this.totalFine = this.totalFine + parseInt(this.fines[i].fine);
        let fine = {
          "index":this.fines[i].student.index_no,
          "name":this.fines[i].student.name,
          "contact":this.fines[i].student.email,
          "isbn":this.fines[i].isbn,
          "title":this.fines[i].title,
          "bdate":this.fines[i].borrowed_date,
          "odate":this.fines[i].return_date,
          "fine":this.fines[i].fine};
        rows.push(fine);
      }
    }
    rows.push({"index":"TOTAL",
      "name":"",
      "contact":"",
      "isbn":"",
      "title":"",
      "bdate":"",
      "odate":"",
      "fine":"Rs."+this.totalFine});

    html2canvas(document.querySelector("#captureFineTable")).then(function (canvas) {
      const imgData = canvas.toDataURL("image/png");


// Only pt supported (not mm or in)
      let doc = new jsPDF('p', 'pt');
      doc.autoTable(columns, rows, {
        styles: {overflow:"linebreak",fontSize:8,halign:'center'},
        headerStyles: {fillColor:[142,78,156]},
        columnStyles: {
          "index": {columnWidth: 50},
          "name": {columnWidth: 60},
          "contact": {columnWidth: 80},
          "isbn": {columnWidth: 80},
          "title": {columnWidth: 110},
          "bdate": {columnWidth: 50},
          "odate": {columnWidth: 50},
          "fine": {columnWidth: 40}
        },
        margin: {top: 150},
        drawCell: function(cell, data) {
          let rows = data.table.rows;
          if (data.row.index == rows.length - 1) {
            doc.setFillColor(224,224,224);
            doc.setFontSize(11);

          }
        },
        addPageContent: function(data) {
          doc.addImage(imgData, 'PNG', 125,5,330,90);
          doc.setFontSize(18);
          doc.text("Overdue Fine Details",218,126);
        }
      });


      doc.save('Library-Dues-Report.pdf');
      let string = doc.output('datauristring');
      let iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
      let x = window.open();
      x.document.open();
      x.document.write(iframe);
      x.document.close();

    });
  }

}
