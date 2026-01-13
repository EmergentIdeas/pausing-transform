export default async function wait(millis) {
	let pr = new Promise((resolve, reject) => {
		setTimeout(resolve, millis)
	})
	return pr
}