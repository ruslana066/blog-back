import Post from "../models/Post.js";

export const getAll = async (req, res) => {
    try {
        // const posts = await Post.find();
      const posts = await Post.find().populate('user').exec();
      res.json(posts);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить статьи',
      });
    }
  };

export const getOne = async (req, res) => {
try {
    const postId = req.params.id;

    const updatedPost = await Post.findOneAndUpdate(
    {
        _id: postId,
    },
    {
        $inc: { viewsCount: 1 },
    },
    {
        new: true,
    },
    ).populate('user').exec();

    if (!updatedPost) {
    return res.status(404).json({
        message: 'Статья не найдена',
    });
    }
    //console.log(res.json(updatedPost));
    
    res.json(updatedPost);
    
} catch (err) {
    console.log(err);
    res.status(500).json({
    message: 'Не удалось получить статью',
    });
}
};

export const create = async (req, res) => {
    try {
        const doc = new Post({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
          });

          const post = await doc.save();

          res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
  
        const post = await Post.findOneAndDelete(
            {
            _id: postId,
            },
        ).exec();

        if (!post) {
            return res.status(404).json({
            message: 'Статья не найдена',
            });
        }

        res.json({
          success: true,
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось удалить статью',
      });
    }
  };

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await Post.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      },
    ).exec();

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};
  

export const getLastTags = async (req, res) => {
  try {
      // const posts = await Post.find();
    const posts = await Post.find().limit(5).exec();

    const tags = posts.map(post => post.tags).flat()
    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить',
    });
  }
};