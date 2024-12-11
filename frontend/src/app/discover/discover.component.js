"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoverComponent = void 0;
const core_1 = require("@angular/core");
let DiscoverComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-discover',
            templateUrl: './discover.component.html',
            styleUrls: ['./discover.component.css',]
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var DiscoverComponent = _classThis = class {
        constructor(recipeService) {
            this.recipeService = recipeService;
            this.recipeList = [];
            this.selectedRecipes = new Set(); // Track selected recipes by their IDs
            this.loading = true;
            this.error = null;
            this.searchQuery = '';
            this.selectedCategory = '';
            this.maxCookingDuration = null;
        }
        ngOnInit() {
            this.getRecipes();
        }
        getRecipes() {
            this.recipeService.getRecipes().subscribe((data) => {
                this.recipeList = data;
                this.loading = false;
            }, (error) => {
                this.error = 'Failed to load recipes.';
                this.loading = false;
            });
        }
        get uniqueCategories() {
            const categories = this.recipeList.flatMap((recipe) => recipe.meal_category || []);
            return Array.from(new Set(categories)).sort();
        }
        filteredRecipes() {
            return this.recipeList.filter((recipe) => {
                var _a, _b;
                const matchesSearch = (_a = recipe.recipe_name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(this.searchQuery.toLowerCase());
                const matchesCategory = this.selectedCategory
                    ? (_b = recipe.meal_category) === null || _b === void 0 ? void 0 : _b.some((category) => category === this.selectedCategory)
                    : true;
                return matchesSearch && matchesCategory;
            });
        }
        toggleRecipeSelection(recipeId) {
            if (this.selectedRecipes.has(recipeId)) {
                this.selectedRecipes.delete(recipeId); // Remove from selection
            }
            else {
                this.selectedRecipes.add(recipeId); // Add to selection
            }
        }
        saveSelectedRecipes() {
            const selectedRecipeList = this.recipeList.filter(recipe => this.selectedRecipes.has(recipe.recipe_ID));
            console.log('Saving recipes:', selectedRecipeList);
            // Placeholder for API call to save the selected recipes
            // Example:
            // this.recipeService.saveSelectedRecipes(selectedRecipeList).subscribe(
            //   response => console.log('Save successful:', response),
            //   error => console.error('Save failed:', error)
            // );
        }
    };
    __setFunctionName(_classThis, "DiscoverComponent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DiscoverComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DiscoverComponent = _classThis;
})();
exports.DiscoverComponent = DiscoverComponent;
//# sourceMappingURL=discover.component.js.map