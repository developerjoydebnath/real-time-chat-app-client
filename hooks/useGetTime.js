export const useGetTime = () => {
    // Get the current date and time
    const currentDate = new Date();

    // Get hours and minutes
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();

    // Determine if it's AM or PM
    var meridiem = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    // Add leading zero to single-digit minutes
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Create a formatted time string
    const formattedTime = hours + ':' + minutes + ' ' + meridiem;

    const time = formattedTime;

    return time;
};
