exports.install = function (Vue, options) {

  // 权限判断函数
  Vue.prototype.hasPrivileges = function (name) {
    var privileges = JSON.parse(window.sessionStorage.getItem('loginLoucaUser')).privileges;
    return privileges.some(function (currentValue) {
      if (currentValue == name) {
        return true
      }
    })
  };
  //格式化时间
  Vue.prototype.dateFormat = function (d, format = 'yyyy-MM-dd HH:mm:ss') {
    if (!d) return '';
    let date = d;
    switch (typeof date) {
      case 'string':
        date = new Date(date.replace(/-/g, '/'));
        break;
      case 'number':
      default:
        date = new Date(date);
    }
    if (!(date instanceof Date)) return '';

    const dict = {
      yyyy: date.getFullYear(),
      M: date.getMonth() + 1,
      d: date.getDate(),
      H: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds(),
      MM: (`${date.getMonth() + 101}`).substr(1),
      dd: (`${date.getDate() + 100}`).substr(1),
      HH: (`${date.getHours() + 100}`).substr(1),
      mm: (`${date.getMinutes() + 100}`).substr(1),
      ss: (`${date.getSeconds() + 100}`).substr(1),
    };
    try {
      return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, f => dict[f]);
    } catch (e) {
      return '';
    }
  };
  // 导出表格EXCEL

  Vue.prototype.exportExcel = function (tableid) {//整个表格拷贝到EXCEL中
    var idTmr;
    var tableToExcel = (function () {
      var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) },
        format = function (s, c) {
          return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; })
        }
      return function (table, name) {
        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        window.location.href = uri + base64(format(template, ctx))
      }
    })()

    function getExplorer() {
      var explorer = window.navigator.userAgent;
      //ie
      if (explorer.indexOf("MSIE") >= 0) {
        return 'ie';
      }
      //firefox
      else if (explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
      }
      //Chrome
      else if (explorer.indexOf("Chrome") >= 0) {
        return 'Chrome';
      }
      //Opera
      else if (explorer.indexOf("Opera") >= 0) {
        return 'Opera';
      }
      //Safari
      else if (explorer.indexOf("Safari") >= 0) {
        return 'Safari';
      }
    }

    function Cleanup() {
      window.clearInterval(idTmr);
      CollectGarbage();           //回收内存垃圾
    }

    if (getExplorer() == 'ie') {
      var curTbl = document.getElementById(tableid);
      var oXL = new ActiveXObject("Excel.Application");

      //创建AX对象excel
      var oWB = oXL.Workbooks.Add();
      //获取workbook对象
      var xlsheet = oWB.Worksheets(1);
      //激活当前sheet
      var sel = document.body.createTextRange();
      sel.moveToElementText(curTbl);
      //把表格中的内容移到TextRange中
      sel.select;
      //全选TextRange中内容
      sel.execCommand("Copy");
      //复制TextRange中内容
      xlsheet.Paste();
      //粘贴到活动的EXCEL中
      oXL.Visible = true;
      //设置excel可见属性

      try {
        var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
      } catch (e) {
        print("Nested catch caught " + e);
      } finally {
        oWB.SaveAs(fname);

        oWB.Close(savechanges = false);
        //xls.visible = false;
        oXL.Quit();
        oXL = null;
        //结束excel进程，退出完成
        //window.setInterval("Cleanup();",1);
        idTmr = window.setInterval("Cleanup();", 1);

      }

    } else {
      tableToExcel(tableid)
    }
  }

}
