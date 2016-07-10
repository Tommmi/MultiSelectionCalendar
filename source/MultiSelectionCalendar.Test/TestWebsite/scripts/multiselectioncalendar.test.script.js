(function() {
	'use strict';
	var $asm = {};
	global.MultiSelectionCalendar = global.MultiSelectionCalendar || {};
	global.MultiSelectionCalendar.Test = global.MultiSelectionCalendar.Test || {};
	global.MultiSelectionCalendar.Test.Script = global.MultiSelectionCalendar.Test.Script || {};
	ss.initAssembly($asm, 'multiselectioncalendar.test.script');
	////////////////////////////////////////////////////////////////////////////////
	// MultiSelectionCalendar.Test.Script.MyController
	var $MultiSelectionCalendar_Test_Script_MyController = function(_scope) {
		this.$_scope = null;
		this.$_scope = Saltarelle.Utils.Utils.enhance($MultiSelectionCalendar_Test_Script_MyController$MyScope, AngularJS.Scope).call(null, _scope);
		// siehe TUtils
		var $t4 = this.$_scope;
		var $t1 = { ntype: 38, type: $MultiSelectionCalendar_Test_Script_MyController$MyScope, name: 's' };
		var $t2 = { typeDef: $MultiSelectionCalendar_Test_Script_MyController$MyScope, name: 'ranges', type: 4, returnType: Array, sname: 'ranges' };
		var $t3 = { ntype: 23, type: $t2.returnType, expression: $t1, member: $t2 };
		Saltarelle.Utils.Utils.watchProperty($MultiSelectionCalendar_Test_Script_MyController$MyScope, Array).call(null, $t4, { ntype: 18, type: Function, returnType: $t3.type, body: $t3, params: [$t1] }, ss.mkdel(this, this.$onRangesChanged));
		var $t8 = this.$_scope;
		var $t5 = { ntype: 38, type: $MultiSelectionCalendar_Test_Script_MyController$MyScope, name: 's' };
		var $t6 = { typeDef: $MultiSelectionCalendar_Test_Script_MyController$MyScope, name: 'rangesAsString', type: 4, returnType: String, sname: 'rangesAsString' };
		var $t7 = { ntype: 23, type: $t6.returnType, expression: $t5, member: $t6 };
		Saltarelle.Utils.Utils.watchProperty($MultiSelectionCalendar_Test_Script_MyController$MyScope, String).call(null, $t8, { ntype: 18, type: Function, returnType: $t7.type, body: $t7, params: [$t5] }, ss.mkdel(this, this.$onRangesAsStringChanged));
		this.$_scope.activeColorIdx = 1;
		var $t10 = this.$_scope;
		var $t9 = [];
		$t9.push(new global.MultiSelectionCalendar.Range(new Date(2015, 10 - 1, 1), new Date(2015, 10 - 1, 5), 1));
		$t9.push(new global.MultiSelectionCalendar.Range(new Date(2015, 11 - 1, 5), new Date(2015, 11 - 1, 5), 3));
		$t10.ranges = $t9;
	};
	$MultiSelectionCalendar_Test_Script_MyController.__typeName = 'MultiSelectionCalendar.Test.Script.MyController';
	global.MultiSelectionCalendar.Test.Script.MyController = $MultiSelectionCalendar_Test_Script_MyController;
	////////////////////////////////////////////////////////////////////////////////
	// MultiSelectionCalendar.Test.Script.MyController.MyScope
	var $MultiSelectionCalendar_Test_Script_MyController$MyScope = function() {
		this.activeColorIdx = 0;
		this.ranges = null;
		this.rangesAsString = null;
		this.rangesAsFormattedDisplayTexts = null;
		AngularJS.Scope.call(this);
	};
	$MultiSelectionCalendar_Test_Script_MyController$MyScope.__typeName = 'MultiSelectionCalendar.Test.Script.MyController$MyScope';
	global.MultiSelectionCalendar.Test.Script.MyController$MyScope = $MultiSelectionCalendar_Test_Script_MyController$MyScope;
	////////////////////////////////////////////////////////////////////////////////
	// MultiSelectionCalendar.Test.Script.SelectionOptionEnum
	var $MultiSelectionCalendar_Test_Script_SelectionOptionEnum = function() {
	};
	$MultiSelectionCalendar_Test_Script_SelectionOptionEnum.__typeName = 'MultiSelectionCalendar.Test.Script.SelectionOptionEnum';
	global.MultiSelectionCalendar.Test.Script.SelectionOptionEnum = $MultiSelectionCalendar_Test_Script_SelectionOptionEnum;
	////////////////////////////////////////////////////////////////////////////////
	// MultiSelectionCalendar1.Test.Script.Program
	var $MultiSelectionCalendar1_Test_Script_$Program = function() {
	};
	$MultiSelectionCalendar1_Test_Script_$Program.__typeName = 'MultiSelectionCalendar1.Test.Script.$Program';
	$MultiSelectionCalendar1_Test_Script_$Program.$main = function() {
		$('.test').change($MultiSelectionCalendar1_Test_Script_$Program.$onInputChanged);
		var module = angular.module('multiSelectorCalendarTest', []);
		AngularJS.ModuleBuilder.Controller($MultiSelectionCalendar_Test_Script_MyController).call(null, module, []);
	};
	$MultiSelectionCalendar1_Test_Script_$Program.$onInputChanged = function(queryEvent) {
	};
	ss.initClass($MultiSelectionCalendar_Test_Script_MyController, $asm, {
		$onRangesChanged: function(newValue, oldValue) {
			this.$updateRanges();
		},
		$onRangesAsStringChanged: function(newvalue, oldvalue) {
			if (ss.referenceEquals(newvalue, oldvalue)) {
				return;
			}
			this.$_scope.ranges = global.MultiSelectionCalendar.MultiSelectionCalendar.getDateRangesFromString(newvalue);
			this.$updateRanges();
		},
		$updateRanges: function() {
			this.$_scope.rangesAsString = global.MultiSelectionCalendar.MultiSelectionCalendar.getStringFromDateRanges(Enumerable.from(this.$_scope.ranges).toArray());
			this.$_scope.rangesAsFormattedDisplayTexts = Enumerable.from(this.$_scope.ranges).select(function(r) {
				return ss.formatString('{0}: {1:dd.MM.yyyy} - {2:dd.MM.yyyy}', r.get_selectionIdx().toString(), r.get_start(), r.get_end());
			}).toArray();
		}
	});
	ss.initClass($MultiSelectionCalendar_Test_Script_MyController$MyScope, $asm, {}, AngularJS.Scope);
	ss.initEnum($MultiSelectionCalendar_Test_Script_SelectionOptionEnum, $asm, { delete$1: 0, red: 1, green: 2, blue: 3 });
	ss.initClass($MultiSelectionCalendar1_Test_Script_$Program, $asm, {});
	ss.setMetadata($MultiSelectionCalendar_Test_Script_MyController, { attr: [new AngularJS.InjectAttribute(['$scope'])] });
	$MultiSelectionCalendar1_Test_Script_$Program.$main();
})();
