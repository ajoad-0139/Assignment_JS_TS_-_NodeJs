export const getImages = async (req, res) => {
    //find the base url
    const BASE_URL = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

    // image file names 
    const filenames = [
        "image_01.avif",
        "image_02.avif",
        "image_03.avif",
        "image_04.avif",
        "image_05.avif",
        "image_06.avif",
        "image_07.avif",
        "image_08.avif",
        "image_09.avif",
        "image_10.avif"
    ];

    const images = filenames.map((name) => `${BASE_URL}/static/images/${name}`);

    return res.status(200).json({ success: true, data: images });
};