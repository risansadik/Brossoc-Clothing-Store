const Wishlist = require('../../models/wishlistSchema');
const Product = require('../../models/productSchema');

const getWishlist = async (req, res) => {
    try {
        const userId = req.session.user;

        const wishlist = await Wishlist.findOne({ userId }).populate({
            path: 'products.productId',
            model: 'Product',
            select: 'productName productImage regularPrice salePrice sizeVariants'
        });

        res.render('wishlist', {
            wishlist: wishlist || { products: [] }
        });
    } catch (error) {
        console.error('Wishlist fetch error:', error);
        res.render('wishlist', {
            wishlist: { products: [] },
            error: 'Failed to load wishlist'
        });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const userId = req.session.user;
        const { productId, size, quantity } = req.body;

        if (!size || !quantity) {
            return res.status(400).json({ success: false, message: 'Size and quantity are required' });
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({
                userId,
                products: [{ productId, size, quantity }]
            });
        } else {
            const productExists = wishlist.products.find(item => 
                item.productId.toString() === productId && item.size === size
            );

            if (productExists) {
                productExists.quantity = quantity; // Update quantity if it exists
            } else {
                wishlist.products.push({ productId, size, quantity });
            }
        }

        await wishlist.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ success: false, error: 'Failed to add to wishlist' });
    }
}

const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.session.user;
        const productId = req.params.productId;
        const size = req.query.size; // Can pass size via query params

        let pullQuery = { productId };
        if (size) pullQuery.size = size;

        await Wishlist.updateOne(
            { userId },
            { $pull: { products: pullQuery } }
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ success: false, error: 'Failed to remove from wishlist' });
    }
}

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist
};