// Get command line arguments
const args = process.argv.slice(2);

// Parse and process the arguments
args.forEach((arg, index) => {
    console.log(`Argument ${index + 1}: ${arg}`);
});