$(document).ready(function() {
	$(document).on('click', 'div.slick-cell.l2.r2', addEdit);

	$(document).on('click', 'div.slick-edit-dialog button.var-save', function(e) {
		//$('div.slick-edit-dialog button.var-cancel').click();
	});
});

function addEdit() {

	$('button.btn.btn-link.var-prompt').after('<button style="float: left;" class="btn btn-link var-edit">Edit</button>');

	$('div.slick-edit-dialog').on('click', 'button.var-edit', function(e) {
		$('body').append('<div class="varedit-pagewrap"></div> <div class="varedit-modal slick-edit-dialog">     <h5 class="varedit-title"></h5>     <div class="varedit-nav">         <select class="var-mode">             <option value="none">No highlighting</option>             <option value="json">JSON</option>             <option value="nginx">NGINX</option>             <option value="powershell">PowerShell</option>             <option value="xml">XML</option>         </select>         <label><input class="var-wraplines" type="checkbox" checked />Wrap lines</label>         <label><input class="var-whitespace" type="checkbox" />Show whitespace</label>         <div class="varedit-buttons">             <button class="btn btn-success var-apply">Apply</button>             <button class="btn btn-link var-cancel">Cancel</button>         </div>     </div> </div>');

		$('body').addClass('modal-open');

		var name = $('.slick-cell.selected').prev().text();
		var scope = $('.slick-cell.selected').next().text();

		if (scope.length > 0) {
			scope = ' (Scope: ' + scope + ')'
		}

		$('.varedit-title').text('Edit: ' + name + scope);

		var myCodeMirror = CodeMirror($('div.varedit-modal')[0],
		{
			value: $('textarea').val(),
			mode: "none",
			lineNumbers: true,
			lineWrapping: true,
			styleActiveLine: true
		});

		$('div.varedit-modal').on('change', 'select.var-mode', function(e) {
			switch($(this).val()) {
				case 'json':
					setJsonMode(myCodeMirror);
					break;
				case 'nginx':
					setNginxMode(myCodeMirror);
					break;
			    case 'powershell':
			        setPowerShellMode(myCodeMirror);
			        break;
			    case 'xml':
			        setXmlMode(myCodeMirror);
			        break;
			    default:
			        resetMode(myCodeMirror);
			}
		});

		$('div.varedit-modal').on('click', 'input.var-wraplines', function(e) {
			myCodeMirror.setOption('lineWrapping', this.checked);
		});

		$('div.varedit-modal').on('click', 'input.var-whitespace', function(e) {
			myCodeMirror.setOption('showInvisibles', this.checked);
		});

		$('div.varedit-modal').on('click', 'button.var-apply', function(e) {
			$('textarea').val(myCodeMirror.getValue());
			removeEditor(myCodeMirror);
			$('div.slick-edit-dialog button.var-save').click();
			$('div.slick-edit-dialog button.var-cancel').click();
		});

		$('div.varedit-modal').on('click', 'button.var-cancel', function(e) {
			removeEditor(myCodeMirror);
			$('div.slick-edit-dialog button.var-cancel').click();
		});
	});
}

function removeEditor(editor) {
	editor.setOption('showInvisibles', false);
	$('div.varedit-pagewrap').remove();
	$('div.varedit-modal').remove();
	$('body').removeClass('modal-open');
}

function resetMode(editor) {
	editor.setOption('mode', 'none');
	editor.setOption('foldGutter', false);
	editor.setOption('gutters', []);
}

function setJsonMode(editor) {
	resetMode(editor);
	editor.setOption('mode', { name: 'javascript', json: true });
}

function setNginxMode(editor) {
	resetMode(editor);
	editor.setOption('mode', 'nginx');
}

function setPowerShellMode(editor) {
	resetMode(editor);
	editor.setOption('mode', 'powershell');
}

function setXmlMode(editor) {
	resetMode(editor);
	editor.setOption('mode', 'xml');
	editor.setOption('foldGutter', true);
	editor.setOption('gutters', ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]);
}
