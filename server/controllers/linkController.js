const Link = require('../models/Link');

// @desc    Get all links for user
// @route   GET /api/links
// @access  Private
const getLinks = async (req, res) => {
    try {
        const links = await Link.find({ userId: req.user._id })
            .sort({ position: 1 })
            .select('-__v');

        res.json({
            success: true,
            data: {
                links,
                count: links.length
            }
        });
    } catch (error) {
        console.error('Get links error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching links'
        });
    }
};

// @desc    Get single link
// @route   GET /api/links/:id
// @access  Private
const getLink = async (req, res) => {
    try {
        const link = await Link.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!link) {
            return res.status(404).json({
                success: false,
                message: 'Link not found'
            });
        }

        res.json({
            success: true,
            data: { link }
        });
    } catch (error) {
        console.error('Get link error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching link'
        });
    }
};

// @desc    Create new link
// @route   POST /api/links
// @access  Private
const createLink = async (req, res) => {
    try {
        // Check plan limits for free users
        if (req.user.plan === 'free') {
            const linkCount = await Link.countDocuments({ userId: req.user._id });
            if (linkCount >= 10) {
                return res.status(403).json({
                    success: false,
                    message: 'Free plan limited to 10 links. Please upgrade to add more.'
                });
            }
        }

        // Get the highest position and add 1
        const highestPositionLink = await Link.findOne({ userId: req.user._id })
            .sort({ position: -1 })
            .select('position');

        const position = highestPositionLink ? highestPositionLink.position + 1 : 0;

        const link = await Link.create({
            ...req.body,
            userId: req.user._id,
            position
        });

        res.status(201).json({
            success: true,
            message: 'Link created successfully',
            data: { link }
        });
    } catch (error) {
        console.error('Create link error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating link'
        });
    }
};

// @desc    Update link
// @route   PUT /api/links/:id
// @access  Private
const updateLink = async (req, res) => {
    try {
        const link = await Link.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!link) {
            return res.status(404).json({
                success: false,
                message: 'Link not found'
            });
        }

        // Update fields
        const allowedFields = [
            'title', 'url', 'isActive', 'icon',
            'schedule', 'geoTargeting', 'deviceTargeting', 'rotation'
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                link[field] = req.body[field];
            }
        });

        await link.save();

        res.json({
            success: true,
            message: 'Link updated successfully',
            data: { link }
        });
    } catch (error) {
        console.error('Update link error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating link'
        });
    }
};

// @desc    Delete link
// @route   DELETE /api/links/:id
// @access  Private
const deleteLink = async (req, res) => {
    try {
        const link = await Link.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!link) {
            return res.status(404).json({
                success: false,
                message: 'Link not found'
            });
        }

        await link.deleteOne();

        res.json({
            success: true,
            message: 'Link deleted successfully'
        });
    } catch (error) {
        console.error('Delete link error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting link'
        });
    }
};

// @desc    Reorder links
// @route   PATCH /api/links/reorder
// @access  Private
const reorderLinks = async (req, res) => {
    try {
        const { links } = req.body; // Array of { id, position }

        if (!Array.isArray(links)) {
            return res.status(400).json({
                success: false,
                message: 'Links must be an array'
            });
        }

        // Update positions
        const updatePromises = links.map(({ id, position }) =>
            Link.updateOne(
                { _id: id, userId: req.user._id },
                { position }
            )
        );

        await Promise.all(updatePromises);

        res.json({
            success: true,
            message: 'Links reordered successfully'
        });
    } catch (error) {
        console.error('Reorder links error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error reordering links'
        });
    }
};

// @desc    Toggle link active status
// @route   PATCH /api/links/:id/toggle
// @access  Private
const toggleLink = async (req, res) => {
    try {
        const link = await Link.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!link) {
            return res.status(404).json({
                success: false,
                message: 'Link not found'
            });
        }

        link.isActive = !link.isActive;
        await link.save();

        res.json({
            success: true,
            message: `Link ${link.isActive ? 'activated' : 'deactivated'} successfully`,
            data: { link }
        });
    } catch (error) {
        console.error('Toggle link error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error toggling link'
        });
    }
};

module.exports = {
    getLinks,
    getLink,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
    toggleLink
};
