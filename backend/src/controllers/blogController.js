const { BlogPost, User, BlogComment } = require('../models');
const { Op } = require('sequelize');
const slugify = require('slugify');

// Get all blog posts with pagination and filtering
const getBlogPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const category = req.query.category;
    const tag = req.query.tag;
    const search = req.query.search;
    const status = req.query.status || 'published'; // Default to published posts

    // Build filter conditions
    const whereConditions = { status };

    if (category) {
      whereConditions.category = category;
    }

    if (tag) {
      whereConditions.tags = { [Op.contains]: [tag] };
    }

    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { excerpt: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: posts } = await BlogPost.findAndCountAll({
      where: whereConditions,
      limit,
      offset,
      order: [['publishedAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
        }
      ]
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);
    const hasMore = page < totalPages;

    res.status(200).json({
      success: true,
      count,
      totalPages,
      currentPage: page,
      hasMore,
      posts
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog posts',
      error: error.message
    });
  }
};

// Get featured blog posts
const getFeaturedBlogPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;

    const posts = await BlogPost.findAll({
      where: {
        status: 'published',
        viewCount: { [Op.gt]: 0 }
      },
      limit,
      order: [['viewCount', 'DESC'], ['publishedAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    res.status(200).json({
      success: true,
      posts
    });
  } catch (error) {
    console.error('Error fetching featured blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured blog posts',
      error: error.message
    });
  }
};

// Get recent blog posts
const getRecentBlogPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const posts = await BlogPost.findAll({
      where: { status: 'published' },
      limit,
      order: [['publishedAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    res.status(200).json({
      success: true,
      posts
    });
  } catch (error) {
    console.error('Error fetching recent blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent blog posts',
      error: error.message
    });
  }
};

// Get blog post by ID
const getBlogPostById = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await BlogPost.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
        },
        {
          model: BlogComment,
          as: 'comments',
          where: { status: 'approved' },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'avatar']
            }
          ]
        }
      ]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    await post.update({ viewCount: post.viewCount + 1 });

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error(`Error fetching blog post with ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message
    });
  }
};

// Get blog post by slug
const getBlogPostBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;

    const post = await BlogPost.findOne({
      where: { slug },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
        },
        {
          model: BlogComment,
          as: 'comments',
          where: { status: 'approved' },
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'firstName', 'lastName', 'avatar']
            }
          ]
        }
      ]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    await post.update({ viewCount: post.viewCount + 1 });

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error(`Error fetching blog post with slug ${req.params.slug}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post',
      error: error.message
    });
  }
};

// Create a new blog post
const createBlogPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, status } = req.body;

    // Generate slug from title
    let slug = slugify(title, { lower: true, strict: true });

    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ where: { slug } });
    if (existingPost) {
      // Append a timestamp to make the slug unique
      slug = `${slug}-${Date.now()}`;
    }

    // Get featured image from file upload
    const featuredImage = req.file ? req.file.filename : null;

    const post = await BlogPost.create({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      featuredImage,
      category,
      tags: tags ? JSON.parse(tags) : [],
      status,
      authorId: req.user.id,
      publishedAt: status === 'published' ? new Date() : null
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      post
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message
    });
  }
};

// Update a blog post
const updateBlogPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, excerpt, category, tags, status } = req.body;

    const post = await BlogPost.findByPk(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check if user is the author or an admin
    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog post'
      });
    }

    // Generate new slug if title changed
    let slug = post.slug;
    if (title && title !== post.title) {
      slug = slugify(title, { lower: true, strict: true });

      // Check if new slug already exists
      const existingPost = await BlogPost.findOne({
        where: {
          slug,
          id: { [Op.ne]: postId }
        }
      });

      if (existingPost) {
        // Append a timestamp to make the slug unique
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Get featured image from file upload or keep existing
    const featuredImage = req.file ? req.file.filename : post.featuredImage;

    // Update post
    await post.update({
      title: title || post.title,
      slug,
      content: content || post.content,
      excerpt: excerpt || (content ? content.substring(0, 200) + '...' : post.excerpt),
      featuredImage,
      category: category || post.category,
      tags: tags ? JSON.parse(tags) : post.tags,
      status: status || post.status,
      publishedAt: status === 'published' && !post.publishedAt ? new Date() : post.publishedAt
    });

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      post
    });
  } catch (error) {
    console.error(`Error updating blog post with ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog post',
      error: error.message
    });
  }
};

// Delete a blog post
const deleteBlogPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await BlogPost.findByPk(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check if user is the author or an admin
    if (post.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog post'
      });
    }

    // Delete post
    await post.destroy();

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting blog post with ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog post',
      error: error.message
    });
  }
};

// Get blog categories
const getBlogCategories = async (req, res) => {
  try {
    const categories = await BlogPost.findAll({
      attributes: ['category'],
      where: { status: 'published' },
      group: ['category'],
      order: [['category', 'ASC']]
    });

    res.status(200).json({
      success: true,
      categories: categories.map(c => c.category)
    });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog categories',
      error: error.message
    });
  }
};

// Get blog tags
const getBlogTags = async (req, res) => {
  try {
    const posts = await BlogPost.findAll({
      attributes: ['tags'],
      where: {
        status: 'published',
        tags: { [Op.ne]: [] }
      }
    });

    // Extract and flatten all tags
    const allTags = posts.flatMap(post => post.tags);

    // Count occurrences of each tag
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

    // Convert to array of objects with name and count
    const tags = Object.entries(tagCounts).map(([name, count]) => ({
      name,
      count
    }));

    // Sort by count (descending)
    tags.sort((a, b) => b.count - a.count);

    res.status(200).json({
      success: true,
      tags
    });
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog tags',
      error: error.message
    });
  }
};

// Add a comment to a blog post
const addBlogComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    // Check if post exists
    const post = await BlogPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Create comment
    const comment = await BlogComment.create({
      content,
      postId,
      userId: req.user.id,
      status: 'pending' // All comments start as pending
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully and pending approval',
      comment
    });
  } catch (error) {
    console.error('Error adding blog comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding blog comment',
      error: error.message
    });
  }
};

// Approve a blog comment
const approveBlogComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await BlogComment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Update comment status
    await comment.update({ status: 'approved' });

    res.status(200).json({
      success: true,
      message: 'Comment approved successfully',
      comment
    });
  } catch (error) {
    console.error(`Error approving comment with ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error approving comment',
      error: error.message
    });
  }
};

// Reject a blog comment
const rejectBlogComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await BlogComment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Update comment status
    await comment.update({ status: 'rejected' });

    res.status(200).json({
      success: true,
      message: 'Comment rejected successfully',
      comment
    });
  } catch (error) {
    console.error(`Error rejecting comment with ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting comment',
      error: error.message
    });
  }
};

module.exports = {
  getBlogPosts,
  getFeaturedBlogPosts,
  getRecentBlogPosts,
  getBlogPostById,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogCategories,
  getBlogTags,
  addBlogComment,
  approveBlogComment,
  rejectBlogComment
};
