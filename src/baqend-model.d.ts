import {binding, GeoPoint} from "baqend";

declare module "baqend" {

  interface baqend {
    Comment: binding.EntityFactory<model.Comment>;
    Post: binding.EntityFactory<model.Post>;
  }

  namespace model {
    interface Device extends binding.Entity {
      deviceOs: string;
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
      post: Post;
    }

    interface Post extends binding.Entity {
      title: string;
      text: string;
      slug: string;
    }

  }
}