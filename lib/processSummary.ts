export function ProcessSummary(summary: string) {
    let output = summary;
    let i = output.indexOf("<a");
    if (i !== -1) {
        output = output.substring(0, i);
    }
    i = output.lastIndexOf("spoonacular");
    if (i !== -1) {
        output = output.substring(0, i);
    }
    i = output.lastIndexOf(".");
    if (i !== -1) {
        output = output.substring(0, i+1);
    }
    return output;
}