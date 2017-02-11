import {binding, GeoPoint} from "baqend";

declare module "baqend" {

  interface baqend {
    Tag: binding.EntityFactory<model.Tag>;
    Comment: binding.EntityFactory<model.Comment>;
    Post: binding.EntityFactory<model.Post>;
  }

  namespace model {
    interface Device extends binding.Entity {
      deviceOs: string;
    }

    interface Tag extends binding.Entity {
      name: string;
      alias: string;
    }

    interface Role extends binding.Entity {
      name: string;
      users: Set<User>;
    }

    interface User extends binding.Entity {
      username: string;
      inactive: boolean;
    }

    interface Comment extends binding.Entity {
      text: string;
      name: string;
      email: string;
    }

    interface Post extends binding.Entity {
      title: string;
      text: string;
      tags: Set<Tag>;
      slug: string;
      preview_image: undefined;
      description: string;
      comments: Set<Comment>;
    }

  }
}