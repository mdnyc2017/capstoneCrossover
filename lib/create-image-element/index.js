export default function createImageElement(imageUrl, elementCreated) {
    const image = new window.Image()
    image.src = imageUrl;
    image.crossOrigin = "Anonymous"
    image.addEventListener('load', (e) => {
        elementCreated(image)
    }, false)
}