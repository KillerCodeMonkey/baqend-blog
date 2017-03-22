import {binding, GeoPoint} from "baqend";

declare module "baqend" {

  interface baqend {
    Comment: binding.EntityFactory<model.Comment>;
    Post: binding.EntityFactory<model.Post>;
    Tag: binding.EntityFactory<model.Tag>;
  }

  namespace model {
    interface Role extends binding.Entity {
      name: string;
      users: Set<User>;
    }

    interface User extends binding.Entity {
      username: string;
      inactive: boolean;
    }

    interface Device extends binding.Entity {
      deviceOs: string;
    }

    interface Comment extends binding.Entity {
      text: string;
      name: string;
      email: string;
      post: Post;
    }

    interface Post extends binding.Entity {
      title: string;
      text: string;
      tags: Set<Tag>;
      slug: string;
      preview_image: undefined;
      description: string;
      publishedAt: Date;
      images: Array<undefined>;
      comments: Set<Comment>;
    }

    interface Tag extends binding.Entity {
      name: string;
      alias: string;
    }

  }
}