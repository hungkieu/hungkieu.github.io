var database = firebase.database();
var rootref = database.ref("/");
var reportsref = database.ref("/reports");
var reports;
reportsref.on('value', function (snap) {
  reports = snap.val();
  window.reports = reports;
});

SideKiqPage = {
  get() {
    let processed = document.querySelector('.processed .count').textContent;
    processed = parseInt(processed.replace(/,/g, ""));

    let enqueued = document.querySelector('.enqueued .count').textContent;
    enqueued = parseInt(enqueued.replace(/,/g, ""));

    return { processed, enqueued };
  },

  update(processed, enqueued) {
    var index = reports.length;
    var created_at = new Date().getTime();
    var new_reportref = database.ref("reports/" + index);
    return new_reportref.set({processed, enqueued, created_at});
  }
}

$(document).ready(function () {
  function count_start_to_end(el, start, end) {
    let options = {
      startVal: start,
      duration: 3,
    };
    let count = new CountUp(el, end, options);
    count.start();
  }

  function format_time(timestamp) {
    d = new Date(timestamp);
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} - ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
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

    let processed_count = parseInt($('#Processed-count').text());
    count_start_to_end('Processed-count', processed_count, processed);

    let enqueued_count = parseInt($('#Queued-count').text());
    count_start_to_end('Queued-count', enqueued_count, enqueued);

    let pre_processed_count = parseInt($('#Processed-count-p').text());
    let compare_processed = processed - pre_processed;
    count_start_to_end('Processed-count-p', pre_processed_count, compare_processed);

    let pre_enqueued_count = parseInt($('#Queued-count').text());
    let compare_enqueued = enqueued - pre_enqueued;
    count_start_to_end('Queued-count-p', pre_enqueued_count, compare_enqueued);
  });
});
