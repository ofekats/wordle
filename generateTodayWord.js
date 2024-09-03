//this file contain the function that generates the answer word for each day

function getIsraelDate() {
    const now = new Date();
    const isDST = now.getMonth() > 2 && now.getMonth() < 10; // DST typically starts in March and ends in October
    const israelOffset = now.getTimezoneOffset() + (isDST ? 180 : 120); // UTC+3 for summer, UTC+2 for winter
    const israelDate = new Date(now.getTime() + israelOffset * 60 * 1000);
    return israelDate.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD'
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

  