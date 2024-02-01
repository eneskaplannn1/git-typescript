class Commit {
  constructor(
    public name: string,
    public parent: Commit | null,
    public id: number
  ) {}
}

class Branch {
  constructor(public name: string, public commit: Commit | null) {}
}

class Git {
  name: string;
  branches: Branch[];
  lastCommit: number;
  HEAD: Branch;

  constructor(name: string) {
    this.name = name; // refers to git init
    this.branches = []; // list of all branches
    this.lastCommit = -1; // Refers to the latest commit

    const master = new Branch("master", null); // Since there is no commit yet, null is passed
    this.branches.push(master);

    this.HEAD = master; // Head will be set to the master branch
  }

  commit(message: string): Commit {
    const commit: Commit = new Commit(
      message,
      this.HEAD.commit,
      ++this.lastCommit
    );
    this.HEAD.commit = commit;
    return commit;
  }

  checkout(branchName: string): Git {
    for (let i = this.branches.length; i--; ) {
      if (this.branches[i].name == branchName) {
        console.log("Switched to existing branch: " + branchName);

        this.HEAD = this.branches[i];

        return this;
      }
    }

    const newBranch = new Branch(branchName, this.HEAD.commit);

    this.branches.push(newBranch);

    this.HEAD = newBranch;

    console.log("Switched to new branch: " + branchName);

    return this;
  }

  log(): number[] {
    let commit: Commit | null = this.HEAD.commit;
    const history: number[] = [];

    while (commit) {
      history.push(commit.id);

      commit = commit.parent;
    }

    return history;
  }
}

const MasterBranch: Branch = {
  name: "dmmy_Name",
  commit: {
    name: "last commit",
    id: 3,
    parent: {
      name: "second commit ",
      id: 2,
      parent: {
        name: "initial commit",
        id: 1,
        parent: null,
      },
    },
  },
};
const MainBranch: Branch = {
  name: "dmmy_Name",
  commit: {
    name: "last commit",
    id: 3,
    parent: {
      name: "second commit ",
      id: 2,
      parent: {
        name: "initial commit",
        id: 1,
        parent: null,
      },
    },
  },
};
const Branches = [MasterBranch, MainBranch];
