// @vitest-environment happy-dom

import { describe, test, expect } from 'vitest'
import { computeTargetIndex, isDropIntoOwnSubtree, resolveSidebarDropTarget } from './sidebar-drop'

function buildSidebar() {
    document.body.innerHTML = `
        <div class="sidebar-list-container">
            <div class="sidebar-list">
                <div class="sidebar-item" data-id="A" data-type="request_group"></div>
                <div class="sidebar-list" data-parent-id="A">
                    <div class="sidebar-item" data-id="A1" data-parent-id="A" data-type="request"></div>
                    <div class="sidebar-item" data-id="A2" data-parent-id="A" data-type="request"></div>
                </div>
                <div class="sidebar-item" data-id="B" data-type="request"></div>
            </div>
        </div>
    `
    return {
        container: document.querySelector('.sidebar-list-container') as HTMLElement,
        nestedList: document.querySelector('.sidebar-list .sidebar-list') as HTMLElement,
        topLevelList: document.querySelector('.sidebar-list') as HTMLElement,
    }
}

describe('computeTargetIndex', () => {
    test('dropping on the bottom half of a socket inserts after it', () => {
        const list = [{ _id: 'a' }, { _id: 'sock' }, { _id: 'c' }]
        const index = computeTargetIndex(list, { id: 'sock', type: 'socket', cursorPosition: 'bottom' })
        expect(index).toBe(2)
    })

    test('dropping into the bottom half of a folder inserts at the start of its children', () => {
        const folderChildren = [{ _id: 'x' }, { _id: 'y' }]
        const index = computeTargetIndex(folderChildren, { id: 'folder', type: 'request_group', cursorPosition: 'bottom' })
        expect(index).toBe(0)
    })

    test('dropping on the bottom of an enclosing list appends to the list', () => {
        const list = [{ _id: 'a' }, { _id: 'b' }, { _id: 'c' }]
        const index = computeTargetIndex(list, { id: undefined, type: 'sidebar-list', cursorPosition: 'bottom' })
        expect(index).toBe(3)
    })

    test('dropping on the top half of an item inserts before it', () => {
        const list = [{ _id: 'a' }, { _id: 'b' }, { _id: 'c' }]
        const index = computeTargetIndex(list, { id: 'b', type: 'request', cursorPosition: 'top' })
        expect(index).toBe(1)
    })
})

describe('isDropIntoOwnSubtree', () => {
    const tree = [
        { _id: 'folder', children: [
            { _id: 'sub', children: [{ _id: 'subChild' }] },
            { _id: 'child' },
        ] },
        { _id: 'other', children: [] },
    ]

    test('dropping a folder into its own nested list is blocked', () => {
        expect(isDropIntoOwnSubtree(tree, 'folder', 'folder')).toBe(true)
    })

    test('dropping a folder into a descendant folder\'s nested list is blocked', () => {
        expect(isDropIntoOwnSubtree(tree, 'folder', 'sub')).toBe(true)
    })

    test('dropping a folder into another folder\'s nested list is allowed', () => {
        expect(isDropIntoOwnSubtree(tree, 'folder', 'other')).toBe(false)
    })

    test('dropping an item into its own parent\'s nested list is allowed', () => {
        expect(isDropIntoOwnSubtree(tree, 'child', 'folder')).toBe(false)
    })

    test('dropping at the root is allowed', () => {
        expect(isDropIntoOwnSubtree(tree, 'folder', undefined)).toBe(false)
    })
})

describe('resolveSidebarDropTarget', () => {
    test('hovering the padding of a folder\'s nested list resolves to that folder as the parent', () => {
        const { nestedList } = buildSidebar()
        const resolved = resolveSidebarDropTarget(nestedList)
        expect(resolved).toMatchObject({ parentId: 'A', id: undefined, type: 'sidebar-list' })
    })

    test('returns the element that should be decorated with drop styling', () => {
        const { nestedList } = buildSidebar()
        const resolved = resolveSidebarDropTarget(nestedList)
        expect(resolved?.element).toBe(nestedList)
    })

    test('dropping on the container\'s empty padding resolves to root', () => {
        const { container, topLevelList } = buildSidebar()
        const resolved = resolveSidebarDropTarget(container)
        expect(resolved).toMatchObject({ parentId: undefined, id: undefined, type: 'sidebar-list' })
        expect(resolved?.element).toBe(topLevelList)
    })
})
