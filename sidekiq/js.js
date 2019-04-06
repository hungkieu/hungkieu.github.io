function loadPage() {
  var database = firebase.database();
  var rootref = database.ref("/");
  var reportsref = database.ref("/reports");
  var reports;
  reportsref.on('value', function (snap) {
    reports = snap.val();
    window.reports = reports;
  });

  $(document).ready(function () {
    function count_start_to_end(el, start, end) {
      let options = {
        startVal: start,
        duration: 3,
      };
      let count = new CountUp(el, end, options);
      count.start();
      return count;
    }

    function format_time(timestamp) {
      d = new Date(timestamp);
      return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} - ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
    }

    reportsref.on('value', function (snap) {
      reports = snap.val();
      window.reports = reports;
      let last_report = reports[reports.length - 1];
      let processed = last_report.processed;
      let enqueued = last_report.enqueued;

      let previous_last_report = reports[reports.length - 2];
      let pre_processed = previous_last_report.processed || 0;
      let pre_enqueued = previous_last_report.enqueued || 0;

      $('#pre_p_t').text(format_time(previous_last_report.created_at));
      $('#pre_q_t').text(format_time(previous_last_report.created_at));

      $('#Processed-count').text(processed);
      $('#Queued-count').text(enqueued);

      let compare_processed = processed - pre_processed;
      $('#Processed-count-p').text(compare_processed);

      let compare_enqueued = enqueued - pre_enqueued;
      $('#Queued-count-p').text(compare_enqueued);

      $('#table-time').html("");
      for (let i = reports.length; i >= 0; i--) {
        if (i % 60 == 0 && i != 0) {
          let tr = $(`<tr></tr>`);
          let r = reports[i];
          let tds = $(`<td>${format_time(r.created_at)}</td><td>${r.processed}</td><td>${r.enqueued}</td>`);
          tr.append(tds);
          $('#table-time').append(tr);
        }
      }
    });
  });
}

loadPage();
