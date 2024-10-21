class Node {
    constructor(value = null) {
        this.value = value
        this.left = null
        this.right = null
    }
}

class Tree {
    constructor() {
        this.root = null
    }

    buildTree(arr, start = 0, end = arr.length - 1) {
        if (start > end) return null
        arr = [...new Set(arr)].sort((a, b) => a - b);

        let mid = Math.floor((start + end) / 2)
        let root = new Node(arr[mid])

        root.left = this.buildTree(arr, start, mid - 1)
        root.right = this.buildTree(arr, mid + 1, end)
        this.root = root
        return root
    }

    insert(root, value) {
        if (!root) return new Node(value);
        if (root.value == value) {
            return root
        }
        if (value < root.value) {
            root.left = this.insert(root.left, value)
        }
        else if (value > root.value) {
            root.right = this.insert(root.right, value)
        }
        return root
    }

    delete(root, value) {
        if (!root) return null;
        if (value < root.value) {
            root.left = this.delete(root.left, value)
        } else if (value > root.value) {
            root.right = this.delete(root.right, value)
        } else {
            if (!root.left && !root.right) {
                return null
            }

            if (!root.left) {
                return root.right
            } else if (!root.right) {
                return root.left
            }

            let successor = this.findMin(root.right)
            root.value = successor.value

            root.right = this.delete(root.right, successor.value)
        }
        this.root = root
        return root
    }

    findMin(root) {
        while (root.left !== null) {
            root = root.left
        }
        return root
    }

    find(root, value) {
        if (!root) return null
        if (value < root.value) {
            root = this.find(root.left, value)
        }
        else if (value > root.value) {
            root = this.find(root.right, value)
        }

        return root
    }

    levelOrder(root, callback) {
        if (!root) return null
        if (typeof callback !== `function`) {
            throw new Error("A callback function is required")
        }
        const queue = [root]
        while (queue.length > 0) {
            let currentNode = queue.shift()
            callback(currentNode)

            if (currentNode.left) {
                queue.push(currentNode.left)
            }
            if (currentNode.right) {
                queue.push(currentNode.right)
            }


        }
    }

    inOrder(root, callback, queue = []) {
        if (!root) return null;
        if (typeof callback !== `function`) {
            throw new Error("A callback function is required")
        }
        this.inOrder(root.left, callback, queue)
        queue.push(root.value)
        callback(root)
        this.inOrder(root.right, callback, queue)

    }
    preOrder(root, callback, queue = []) {
        if (!root) return null;
        if (typeof callback !== `function`) {
            throw new Error("A callback function is required")
        }
        queue.push(root.value)
        callback(root)
        this.preOrder(root.left, callback, queue)
        this.preOrder(root.right, callback, queue)
    }

    postOrder(root, callback, queue = []) {
        if (!root) return null;
        if (typeof callback !== `function`) {
            throw new Error("A callback function is required")
        }

        this.postOrder(root.left, callback, queue)
        this.postOrder(root.right, callback, queue)
        queue.push(root.value)
        callback(root)
    }

    height(node) {
        if (!node) return -1
        const leftHeight = this.height(node.left)
        const rightHeight = this.height(node.right)
        return Math.max(leftHeight, rightHeight) + 1
    }

    depth(node) {
        let current = this.root
        let depthCount = 0

        while (current) {
            if (current.value === node.value) {
                return depthCount
            } else if (node.value < current.value) {
                current = current.left
            } else {
                current = current.right
            }
            depthCount++
        }

        return -1
    }
    isBalanced(node) {
        if (!node) return true; // An empty tree is balanced

        const checkBalance = (node) => {
            if (!node) return 0; // Base case: height of empty node is 0

            const leftHeight = checkBalance(node.left);
            const rightHeight = checkBalance(node.right);

            // If the left or right subtree is unbalanced, return -1
            if (leftHeight === -1 || rightHeight === -1) return -1;

            // If the current node is unbalanced
            if (Math.abs(leftHeight - rightHeight) > 1) return -1;

            // Return height of the current node
            return Math.max(leftHeight, rightHeight) + 1;
        };

        return checkBalance(node) !== -1; // If the return value is -1, the tree is unbalanced

    }

    rebalanceTree() {
        const elements = []
        this.inOrder(this.root, printNode, elements)
        return this.buildTree(elements)
    }

}

const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
        return;
    }
    if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};

function printNode(node) {
    console.log(node.value);
}

function generateRandomNumbers(size) {
    const numbers = [];
    while (numbers.length < size) {
        numbers.push(Math.floor(Math.random() * 100)); 
    }
    return numbers;
}

// Function to drive the whole script
function driverScript() {
    // Create a tree from random numbers
    const randomNumbers = generateRandomNumbers(3);
    const tree = new Tree();
    tree.buildTree(randomNumbers);

    // Check if the tree is balanced
    console.log("Is the tree balanced?", tree.isBalanced(tree.root));

    // Print all elements in different orders
    console.log("Level Order:");
    tree.levelOrder(tree.root, printNode);

    console.log("Pre Order:");
    tree.preOrder(tree.root, printNode);

    console.log("In Order:");
    tree.inOrder(tree.root, printNode);

    console.log("Post Order:");
    tree.postOrder(tree.root, printNode);

    // Unbalance the tree by adding several numbers > 100
    [101, 102, 103, 104, 105].forEach(num => tree.insert(tree.root, num));

    // Check if the tree is unbalanced
    console.log("Is the tree balanced after adding > 100?", tree.isBalanced(tree.root));

    // Rebalance the tree
    tree.rebalanceTree(tree.root);

    // Confirm that the tree is balanced
    console.log("Is the tree balanced after rebalancing?", tree.isBalanced(tree.root));

    // Print all elements in different orders after rebalancing
    console.log("Level Order after rebalancing:");
    tree.levelOrder(tree.root, printNode);

    console.log("Pre Order after rebalancing:");
    tree.preOrder(tree.root, printNode);

    console.log("In Order after rebalancing:");
    tree.inOrder(tree.root, printNode);

    console.log("Post Order after rebalancing:");
    tree.postOrder(tree.root, printNode);
}

// Run the driver script
driverScript();