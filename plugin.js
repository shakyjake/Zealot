/*
	20th March 2019 Jake Nicholson
*/
(function(){

	function CK_HasText(element){
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
	
	CKEDITOR.plugins.add('zealot', {
		init : function(editor){
			editor.on('instanceReady', function(event){
				event.editor.dataProcessor.htmlFilter.addRules({
					elements : {
						a : function(element){
							if(!!element.attributes.target){
								if(!element.attributes.rel){
									element.attributes['rel'] = 'noopener';
								}
							}
							if(element.parent.name.toLowerCase() === 'strong' || element.parent.name.toLowerCase() === 'em'){
								element.parent.replaceWithChildren();
							}
							if(!CK_HasText(element)){
								return false;
							}
						},
						span : function(element){
							if(element.parent.name.toLowerCase() === 'span'){
								element.parent.replaceWithChildren();
							}
							if(element.parent.name.toLowerCase() === 'strong' || element.parent.name.toLowerCase() === 'em'){
								element.parent.replaceWithChildren();
							}
							
							if(typeof(element.attributes.class) !== 'undefined'){
								if(element.attributes.class === 'screen-reader-text'){
									if(element.parent.name.toLowerCase() !== 'a'){
										element.replaceWithChildren();
									}
								}
							}
							if(!CK_HasText(element)){
								return false;
							}
							
						},
						strong : function(element){
							if(element.parent.name.toLowerCase() === 'a' || element.parent.name.toLowerCase() === 'em'){
								element.parent.replaceWithChildren();
							} else if(element.parent.name.toLowerCase() === 'span' || element.parent.name.toLowerCase() === 'h1' || element.parent.name.toLowerCase() === 'h2' || element.parent.name.toLowerCase() === 'h3' || element.parent.name.toLowerCase() === 'h4' || element.parent.name.toLowerCase() === 'h5' || element.parent.name.toLowerCase() === 'h6'){
								element.replaceWithChildren();
							}
							if(!element.next && !element.previous){
								element.replaceWithChildren();
							}
							if(!CK_HasText(element)){
								return false;
							}
						},
						em : function(element){
							if(element.parent.name.toLowerCase() === 'strong' || element.parent.name.toLowerCase() === 'a'){
								element.parent.replaceWithChildren();
							} else if(element.parent.name.toLowerCase() === 'span' || element.parent.name.toLowerCase() === 'h1' || element.parent.name.toLowerCase() === 'h2' || element.parent.name.toLowerCase() === 'h3' || element.parent.name.toLowerCase() === 'h4' || element.parent.name.toLowerCase() === 'h5' || element.parent.name.toLowerCase() === 'h6'){
								element.replaceWithChildren();
							}
							if(!element.next && !element.previous){
								element.replaceWithChildren();
							}
							if(!CK_HasText(element)){
								return false;
							}
						},
						p : function(element){
							if(element.parent.name.toLowerCase() === 'li'){
								element.replaceWithChildren();
							}
							if(!CK_HasText(element)){
								return false;
							}
						},
						h1 : function(element){
							if(element.parent.name.toLowerCase() === 'li'){
								element.replaceWithChildren();
							}
							if(!CK_HasText(element)){
								return false;
							}
						},
						h2 : function(element){
							if(element.parent.name.toLowerCase() === 'li'){
								element.replaceWithChildren();
							}
							if(!CK_HasText(element)){
								return false;
							}
						},
						h3 : function(element){
							if(element.parent.name.toLowerCase() === 'li'){
								element.replaceWithChildren();
							}
							if(!CK_HasText(element)){
								return false;
							}
						},
						h4 : function(element){
							if(element.parent.name.toLowerCase() === 'li'){
								element.replaceWithChildren();
							}
							if(!CK_HasText(element)){
								return false;
							}
						},
						h5 : function(element){
							if(element.parent.name.toLowerCase() === 'li'){
								element.replaceWithChildren();
							}
							if(!CK_HasText(element)){
								return false;
							}
						},
						h6 : function(element){
							if(element.parent.name.toLowerCase() === 'li'){
								element.replaceWithChildren();
							}
							if(!CK_HasText(element)){
								return false;
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
				});
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
