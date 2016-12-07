from django.contrib import admin
from models import Announcement, Attribute, Rating, Assessment, Measurement, Tag, Team, Template


class AnnouncementAdmin(admin.ModelAdmin):
    date_hierarchy = "created"
    list_display = ("id", "title", "creator", "created", "updated", "enabled")
    list_display_links = ("id", "title")
    list_filter = ("enabled",)
    readonly_fields = ("id", "created", "updated", "creator")

    def save_model(self, request, obj, form, change):
        if not change:
            # When creating a new announcement, set the creator field.
            obj.creator = request.user
        obj.save()


admin.site.register(Announcement, AnnouncementAdmin)


admin.site.register(Attribute)
admin.site.register(Rating)
admin.site.register(Assessment)
admin.site.register(Measurement)
admin.site.register(Tag)
admin.site.register(Team)
admin.site.register(Template)
