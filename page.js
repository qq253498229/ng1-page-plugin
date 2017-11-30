"use strict";
/**
 *分页指令
 */
angular.module('ngPage', [])
    .directive('ngPage', function () {
      return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
          pageNo: '=',
          pageSize: '=',
          totalCount: '=',
          pageChange: "&",
          showPageCount: '@'
        },
        templateUrl: './ngPageTemplate.html',
        link: function (scope) {

          /**
           * 初始化分页数据
           */
          scope.init = function () {
            if (!scope.showPageCount) {
              scope.showPageCount = 5;
            }
            scope.pageCount = Math.ceil(scope.totalCount / scope.pageSize);
            scope.hasPre = scope.pageNo > 1;
            scope.preNo = scope.hasPre ? scope.pageNo - 1 : scope.pageNo;
            scope.hasNext = scope.pageNo < scope.pageCount;
            scope.nextNo = scope.hasNext ? scope.pageNo + 1 : scope.pageNo;
            scope.pageList = scope.getPageList();
          };

          /**
           * 页数跳转
           * @param pageNo
           */
          scope.goPage = function (pageNo) {
            if (scope.pageNo !== pageNo) {
              scope.pageNo = pageNo;
              scope.$parent.pageNo = pageNo;
              scope.init();
              scope.pageChange();
            }
          };

          /**
           * 获取页码list
           * @returns {Array}
           */
          scope.getPageList = function () {
            var list = [];
            if (scope.pageCount <= scope.showPageCount) {
              for (var i = 1; i < scope.pageCount + 1; i++) {
                list.push(i);
              }
            } else {
              var startNo = scope.pageNo - scope.showPageCount / 2;
              var endNo = scope.pageNo + scope.showPageCount / 2;
              if (startNo < 1) {
                //前几页
                startNo = 1;
                for (var i = 0; i < scope.showPageCount; i++) {
                  list.push(startNo++);
                }
              } else if (endNo > scope.pageCount) {
                //后几页
                endNo = angular.copy(scope.pageCount);
                for (var i = scope.showPageCount; i >= 0; i--) {
                  list.unshift(endNo--);
                }
              } else {
                //中间页
                startNo = Math.ceil(startNo);
                for (var i = 0; i < scope.showPageCount; i++) {
                  list.push(startNo++);
                }
              }
            }
            return list;
          };

          scope.init();

        }
      };

    });