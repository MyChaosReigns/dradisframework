// From: http://extjs.com/learn/Tutorial:Extending_Ext2_Class

Ext.ns('dradis.feeds');

dradis.feeds.Panel=Ext.extend(Ext.Panel, {
  //props (overridable by caller)
  title:'Feeds',
  frame: true,
  border: false,
  layout: 'fit',
  template:  new Ext.XTemplate(
    '<tpl for=".">',
        '<div style="border-bottom: 1px solid #6592CB;"><span style="font-weight:bold">{title}</span> {stamp}</div>',
    '</tpl>',
    '<div class="x-clear"></div>'
  ),
  dataStore: new Ext.data.JsonStore({
    url: '/feeds.json',
    fields: [
        'id', 'action', 'user', 'actioned_at', 'resource', 'value', 'created_at', 'updated_at', 'title', 'stamp'
    ]

  }),



  initComponent: function(){
    // Called during component initialization
    var config ={
        region: 'east',
        collapsible: true,
        //collapsed: true,
        width: 150,
        minWidth: 100,
        header: true,
        titleCollapse: false,
        items: new Ext.DataView({
            store: this.dataStore,
            tpl: this.template,
            autoHeight:true,
            multiSelect: true,
            overClass:'x-view-over',
            itemSelector:'div.thumb-wrap',
            emptyText: 'No feeds to display'
        })

    };

    // Config object has already been applied to 'this' so properties can 
    // be overriden here or new properties (e.g. items, tools, buttons) 
    // can be added, eg:
    Ext.apply(this, config);
    Ext.apply(this.initialConfig, config);
    this.dataStore.load();
        
    // Before parent code
    
    // Call parent (required)
    dradis.feeds.Panel.superclass.initComponent.apply(this, arguments);

    // After parent code
    // e.g. install event handlers on rendered component
  },

  // The refresh method is used to updated the RSS feeds to the latest info
  refresh: function() {
    dradis.feeds.Panel.prototype.dataStore.load();
  }
  // other methods/actions
});

// Refresh the RSS feeds every 10seconds
Ext.TaskMgr.start({ run: dradis.feeds.Panel.prototype.refresh, interval: 10000 });
Ext.reg('feeds', dradis.feeds.Panel);