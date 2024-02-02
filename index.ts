class Commit {
  constructor(
    public author: string,
    public message: string,
    public parent: Commit | null,
    public id: number,
    public date: number
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

  commit(author: string, message: string): Commit {
    const commit: Commit = new Commit(
      author,
      message,
      this.HEAD.commit,
      ++this.lastCommit,
      Date.now()
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

  mergeBranch(branchName: string): Git {
    const branchToMerge: Branch | undefined = this.branches.find(
      (branch) => branch.name === branchName
    );

    if (!branchToMerge) {
      console.log("Error : No branch found!");
      return this;
    }

    const newCommit: Commit = new Commit(
      "System",
      `Merged ${branchName} to ${this.HEAD.name}`,
      this.HEAD.commit,
      this.lastCommit++,
      Date.now()
    );

    this.HEAD.commit = newCommit;

    console.log(`Merged ${branchName} to ${this.HEAD.name}`);
    return this;
  }

  deleteBranch(branchName: string): Git {
    const index: number = this.branches.findIndex(
      (el) => el.name === branchName
    );

    if (index === -1) {
      console.log("Error: No branch found!");
      return this;
    }

    this.branches.splice(index, 1);
    console.log(`Deleted Branch: ${branchName}`);
    return this;
  }

  revertCommit(commitId: number): Git {
    const commitToRevert = this.findCommitById(commitId);

    if (!commitToRevert) {
      console.log("Error : No commit found!");
      return this;
    }

    const newCommit: Commit = new Commit(
      "System",
      `reverted commit ${commitId}`,
      this.HEAD.commit,
      ++this.lastCommit,
      Date.now()
    );

    this.HEAD.commit = newCommit;
    console.log(`Reverted commit ${commitId}`);

    return this;
  }

  findCommitById(commitId: number): Commit | null {
    let commit: Commit | null = this.HEAD.commit;

    while (commit) {
      if (commit.id == commitId) {
        return commit;
      }

      commit = commit.parent;
    }

    return null;
  }

  compareBranches(branchName1: string, branchName2: string): number[] {
    const branch1: Branch | undefined = this.branches.find(
      (branch) => branch.name === branchName1
    );
    const branch2: Branch | undefined = this.branches.find(
      (branch) => branch.name === branchName2
    );
    if (!branch1 && !branch2) {
      console.log("Error: One or more branch not found!");
      return [];
    }

    const history1 = this.getCommitHistory(branch1!);
    const history2 = this.getCommitHistory(branch2!);

    const commonComits = history1.filter((commitId) =>
      history2.includes(commitId)
    );

    return commonComits;
  }

  getCommitHistory(branch: Branch): number[] {
    let commit: Commit | null = branch.commit;
    const history: number[] = [];

    while (commit) {
      history.push(commit.id);

      commit = commit.parent;
    }

    return history;
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

// const MasterBranch: Branch = {
//   name: "dmmy_Name",
//   commit: {
//     name: "last commit",
//     id: 3,
//     parent: {
//       name: "second commit ",
//       id: 2,
//       parent: {
//         name: "initial commit",
//         id: 1,
//         parent: null,
//       },
//     },
//   },
// };
// const MainBranch: Branch = {
//   name: "dmmy_Name",
//   commit: {
//     name: "last commit",
//     id: 3,
//     parent: {
//       name: "second commit ",
//       id: 2,
//       parent: {
//         name: "initial commit",
//         id: 1,
//         parent: null,
//       },
//     },
//   },
// };
// const Branches = [MasterBranch, MainBranch];

const git = new Git("");

git.commit("initial commit");
git.log();

git.checkout("main");
git.commit("updated application");
git.commit("fixed bug");

git.log();

git.checkout("master");
git.log();
