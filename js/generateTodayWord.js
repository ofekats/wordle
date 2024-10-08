//this file contain the function that generates the answer word for each day

function getIsraelDate() {
    const now = new Date();

    // Create an Intl.DateTimeFormat object for Israel's timezone
    const israelDateTimeFormat = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Jerusalem',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    // Format the date to get the correct day in Israel's timezone
    const [
        { value: month },,
        { value: day },,
        { value: year }
    ] = israelDateTimeFormat.formatToParts(now);

    // Return the date in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
}

  
function selectTodaysWord(wordList) {
    const today = getIsraelDate();
    const [year, month, day] = today.split('-');
  
    // Use a combination of year, month, and day to generate a unique index
    const uniqueIndex = (parseInt(year) * 10000 + parseInt(month) * 100 + parseInt(day)) % wordList.length;
  
    let todaysWord = wordList[uniqueIndex];
    todaysWord = todaysWord.toUpperCase();
    return todaysWord;
}

//to check streak
function isDateYesterday(dateString) {
    const now = new Date();
    const isDST = now.getMonth() > 2 && now.getMonth() < 10; // DST typically starts in March and ends in October
    const israelOffset = now.getTimezoneOffset() + (isDST ? 180 : 120); // UTC+3 for summer, UTC+2 for winter
    const israelNow = new Date(now.getTime() + israelOffset * 60 * 1000);

    // Parse the input dateString ('YYYY-MM-DD') into a Date object
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // Months are zero-based in JavaScript

    // Adjust the parsed date to Israel's timezone
    const israelDate = new Date(date.getTime() + israelOffset * 60 * 1000);

    // Get the start and end of yesterday in Israel's timezone
    const startOfYesterday = new Date(israelNow);
    startOfYesterday.setHours(0, 0, 0, 0);
    startOfYesterday.setDate(israelNow.getDate() - 1);

    const endOfYesterday = new Date(startOfYesterday);
    endOfYesterday.setDate(startOfYesterday.getDate() + 1);

    // Check if the given date is within the range of yesterday
    return israelDate >= startOfYesterday && israelDate < endOfYesterday;
}

//to get the answer easily
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        selectTodaysWord,
    };
}