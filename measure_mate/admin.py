from django.contrib import admin
from .models import Announcement, Attribute, Rating, Assessment, Measurement, Tag, Team, Template


class AnnouncementAdmin(admin.ModelAdmin):
    date_hierarchy = "created"
    list_display = ("id", "title", "style", "created", "updated", "enabled")
    list_display_links = ("id", "title")
    list_filter = ("enabled", "style")
    readonly_fields = ("id", "created", "updated")
    fields = ("id", ("title", "enabled"), "style", "content", "created", "updated")
    search_fields = ("title", )


class AttributeAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "template", "rank", "desc_class")
    list_display_links = ("id", "name")
    list_filter = ("template", )
    readonly_fields = ("id", )
    search_fields = ("name", )


class AssessmentAdmin(admin.ModelAdmin):
    date_hierarchy = "updated"
    list_display = ("id", "team", "template", "created", "updated", "status")
    list_filter = ("template", "status", "tags")
    filter_horizontal = ("tags", )
    radio_fields = {"status": admin.VERTICAL}
    readonly_fields = ("id", "created", "updated")
    search_fields = ("team", "tags__name")


class MeasurementAdmin(admin.ModelAdmin):
    list_display = ("id", "assessment", "created", "updated")
    list_filter = ("assessment", )
    readonly_fields = ("id", "created", "updated")


class RatingAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "attribute", "rank", "colour", "desc_class")
    list_display_links = ("id", "name")
    list_filter = ("attribute", "colour", "desc_class")
    readonly_fields = ("id", )
    search_fields = ("name", "tags__name")


class TagAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    readonly_fields = ("id", )
    ordering = ("id", )
    search_fields = ("name", )


class TeamAdmin(admin.ModelAdmin):
    date_hierarchy = "created"
    list_display = ("id", "name", "short_desc", "created", "updated")
    list_display_links = ("id", "name")
    list_filter = ("tags", )
    filter_horizontal = ("tags", )
    readonly_fields = ("id", "created", "updated")
    search_fields = ("name", "tags__name")


class TemplateAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "taggable", "enabled")
    list_display_links = ("id", "name")
    list_filter = ("taggable", "enabled", )
    readonly_fields = ("id", )
    fields = ("id", ("name", "enabled"), "taggable", "short_desc")


admin.site.register(Announcement, AnnouncementAdmin)
admin.site.register(Assessment, AssessmentAdmin)
admin.site.register(Attribute, AttributeAdmin)
admin.site.register(Measurement, MeasurementAdmin)
admin.site.register(Rating, RatingAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Team, TeamAdmin)
admin.site.register(Template, TemplateAdmin)
