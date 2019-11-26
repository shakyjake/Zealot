/*
	Copyright (c) 26th November 2019 Jake Nicholson
*/
(function(){
	
	function OneOf(NodeName, PickFrom){
		return PickFrom.filter(function(Entry){
			return Entry.toLowerCase() === NodeName.toLowerCase();
		}).length > 0;
	}

	function CK_HasText(element){
		if(element.name === 'iframe'){/* Can be empty */
			return true;
		}
		if(element.name === 'video'){/* Can be empty */
			return true;
		}
		if(element.name === 'audio'){/* Can be empty */
			return true;
		}
		if(element.name === 'img'){/* Can't be not empty */
			return true;
		}
		var HasText, Children, i;
		HasText = false;
		if(typeof(element.value) === 'undefined'){
			if(!element.isEmpty){
				Children = element.children;
				i = Children.length;
				while(!!i){
					i -= 1;
					HasText = CK_HasText(Children[i]);
					if(HasText){
						i = 0;
					}
				}
			}
		} else {
			var Value = element.value;
			Value = Value.replace('&nbsp;', ' ');
			Value = Value.replace('&#160;', ' ');
			Value = Value.replace(/[\s\n\r\t]+/g, '');
			HasText = !!Value.length;
		}
		return HasText;
	}
	
	var FILTER_RULES = {
		elements : {
			a : function(element){
				var Removed = false;
				if(!!element.attributes.target){
					if(!element.attributes.rel){
						element.attributes.rel = 'noopener';
					}
				}
				if(OneOf(element.parent.name, ['span', 'strong', 'em'])){
					element.parent.replaceWithChildren();
					Removed = true;
				}
				if(!Removed){
					if(!CK_HasText(element)){
						return false;
					}
				}
			},
			span : function(element){/* this needs to be more aggressive as Word is now wrapping everything in spans */
				var Removed = false;
				if(OneOf(element.parent.name, ['strong', 'em', 'span'])){
					element.replaceWithChildren();
					Removed = true;
				}
				if(!Removed){
					if(!element.next && !element.previous){
						element.replaceWithChildren();
						Removed = true;
					}
				}
				
				if(!Removed){
					if(!CK_HasText(element)){
						return false;
					}
				}
				
			},
			strong : function(element){
				var Removed = false;
				if(OneOf(element.parent.name, ['a', 'strong', 'em', 'span'])){
					element.parent.replaceWithChildren();
					Removed = true;
				} else if(OneOf(element.parent.name, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])){
					element.replaceWithChildren();
					Removed = true;
				}
				if(!Removed){
					if(!element.next && !element.previous){
						element.replaceWithChildren();
						Removed = true;
					}
				}
				if(!Removed){
					if(!CK_HasText(element)){
						return false;
					}
				}
			},
			em : function(element){
				var Removed = false;
				if(OneOf(element.parent.name, ['a', 'strong', 'em', 'span'])){
					element.parent.replaceWithChildren();
					Removed = true;
				} else if(OneOf(element.parent.name, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])){
					element.replaceWithChildren();
					Removed = true;
				}
				if(!Removed){
					if(!element.next && !element.previous){
						element.replaceWithChildren();
						Removed = true;
					}
				}
				if(!Removed){
					if(!CK_HasText(element)){
						return false;
					}
				}
			},
			p : function(element){
				var Removed = false;
				if(typeof(element.parent.name) !== 'undefined'){
					if(element.parent.name.toLowerCase() === 'li'){
						element.replaceWithChildren();
						Removed = true;
					}
				}
				if(!Removed){
					if(!CK_HasText(element)){
						return false;
					}
				}
			},
			h1 : function(element){
				var Removed = false;
				if(typeof(element.parent.name) !== 'undefined'){
					if(element.parent.name.toLowerCase() === 'li'){
						element.replaceWithChildren();
						Removed = true;
					}
				}
				if(!Removed){
					if(!CK_HasText(element)){
						return false;
					}
				}
			},
			h2 : function(element){
				var Removed = false;
				if(typeof(element.parent.name) !== 'undefined'){
					if(element.parent.name.toLowerCase() === 'li'){
						element.replaceWithChildren();
						Removed = true;
					}
				}
				if(!Removed){
					if(!CK_HasText(element)){
						return false;
					}
				}
			},
			h3 : function(element){
				var Removed = false;
				if(typeof(element.parent.name) !== 'undefined'){
					if(element.parent.name.toLowerCase() === 'li'){
						element.replaceWithChildren();
						Removed = true;
					}
				}
				if(!Removed){
					if(!CK_HasText(element)){
						return false;
					}
				}
			},
			h4 : function(element){
				var Removed = false;
				if(typeof(element.parent.name) !== 'undefined'){
					if(element.parent.name.toLowerCase() === 'li'){
						element.replaceWithChildren();
						Removed = true;
					}
				}
				if(!Removed){
					if(!CK_HasText(element)){
						return false;
					}
				}
			},
			h5 : function(element){
				var Removed = false;
				if(typeof(element.parent.name) !== 'undefined'){
					if(element.parent.name.toLowerCase() === 'li'){
						element.replaceWithChildren();
						Removed = true;
					}
				}
				if(!Removed){
					if(!CK_HasText(element)){
						return false;
					}
				}
			},
			h6 : function(element){
				var Removed = false;
				if(typeof(element.parent.name) !== 'undefined'){
					if(element.parent.name.toLowerCase() === 'li'){
						element.replaceWithChildren();
						Removed = true;
					}
				}
				if(!Removed){
					if(!CK_HasText(element)){
						return false;
					}
				}
			},
			table : function(element){
				if(element.isEmpty){
					return false;
				}
				if(element.children.length === 1){
					if(element.children[0].name === 'thead'){
						return false;
					}
				}
				if(element.children.length === 2){
					var TBody;
					TBody = element.children[1];
					if(!CK_HasText(TBody)){
						return false;
					}
				}
				if(!CK_HasText(element)){
					return false;
				}
			}
		}
	};
	
	CKEDITOR.plugins.add('zealot', {
		init : function(editor){
			editor.on('instanceReady', function(event){
				event.editor.dataProcessor.htmlFilter.addRules(FILTER_RULES);
				event.editor.dataProcessor.dataFilter.addRules(FILTER_RULES);
				event.editor.on('selectionChange', function(e){
					var CmdBold, CmdItalic, CmdLink, CmdBQ, CmdListBullet, CmdListNumber;
					CmdBold = this.getCommand('bold');
					CmdItalic = this.getCommand('italic');
					CmdLink = this.getCommand('link');
					CmdBQ = this.getCommand('blockquote');
					CmdListBullet = this.getCommand('bulletedlist');
					CmdListNumber = this.getCommand('numberedlist');
				
					if(e.data.path.lastElement.is('strong')){
						CmdItalic.disable();
						CmdLink.disable();
					} else if(e.data.path.lastElement.is('em')){
						CmdBold.disable();
						CmdLink.disable();
					} else if(e.data.path.lastElement.is('span')){
						CmdBold.disable();
						CmdItalic.disable();
						CmdLink.disable();
					} else if(e.data.path.lastElement.is('h1') || e.data.path.lastElement.is('h2') || e.data.path.lastElement.is('h3') || e.data.path.lastElement.is('h4') || e.data.path.lastElement.is('h5') || e.data.path.lastElement.is('h6')){
						CmdBold.disable();
						CmdItalic.disable();
						CmdBQ.disable();
						CmdListBullet.disable();
						CmdListNumber.disable();
					} else if(e.data.path.lastElement.is('a')){
						CmdItalic.disable();
						CmdBold.disable();
					} else {
						CmdItalic.enable();
						CmdLink.enable();
						CmdBQ.enable();
						CmdListBullet.enable();
						CmdListNumber.enable();
					}
				});
			});
		}
	});

})();
